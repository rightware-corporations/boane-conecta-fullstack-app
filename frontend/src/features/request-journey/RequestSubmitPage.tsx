import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { createIntent, readIntent } from './submission-intent';
import type { SubmissionIntent } from './submission-intent';
import { nextPhase } from './submission-state';
import type { SubmissionEvent, SubmissionPhase } from './submission-state';
import { isUuid } from './types';
import type { DraftDetail, RequestDefinition } from './types';

type ReviewAcceptance = { draftId: string; etag: string; declarationVersion: string; schemaChecksum: string; accepted: true };
function acceptedReview(value: unknown, draftId: string): ReviewAcceptance | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<ReviewAcceptance>;
  return candidate.accepted === true && candidate.draftId === draftId && /^"\d+"$/.test(candidate.etag ?? '') &&
    !!candidate.declarationVersion?.trim() && !!candidate.schemaChecksum?.trim() ? candidate as ReviewAcceptance : null;
}
function compatible(draft: DraftDetail, definition: RequestDefinition): boolean {
  return definition.serviceId === draft.draft.serviceId && definition.serviceVersionId === draft.draft.serviceVersionId &&
    definition.formVersionId === draft.draft.formVersionId && !!definition.schemaChecksum?.trim() &&
    !!definition.declarationVersion?.trim();
}
function editable(draft: DraftDetail): boolean {
  return Number.isFinite(Date.parse(draft.draft.expiresAt)) && Date.parse(draft.draft.expiresAt) > Date.now() &&
    ['IN_PROGRESS', 'READY_FOR_REVIEW'].includes(draft.draft.status);
}

export default function RequestSubmitPage() {
  const { draftId = '' } = useParams();
  const { user } = useAuth();
  const accountId = user?.id ?? '';
  const navigate = useNavigate();
  const location = useLocation();
  const review = useMemo(() => acceptedReview(location.state, draftId), [location.state, draftId]);
  const [phase, setPhase] = useState<SubmissionPhase>('preparing');
  const phaseRef = useRef<SubmissionPhase>('preparing');
  const busy = useRef(false);
  const alive = useRef(true);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState<SubmissionIntent | null>(null);
  const [eligibleToSend, setEligibleToSend] = useState(false);
  const [retryAllowed, setRetryAllowed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const path = `/municipe/pedidos/rascunhos/${draftId}`;
  const move = useCallback((event: SubmissionEvent) => {
    const next = nextPhase(phaseRef.current, event);
    phaseRef.current = next; setPhase(next);
  }, []);
  useEffect(() => {
    alive.current = true;
    if (!isUuid(draftId) || !isUuid(accountId)) { setLoading(false); setMessage('Rascunho ou conta inválida.'); move('stale'); return; }
    let active = true;
    setLoading(true); setRetryAllowed(false); setEligibleToSend(false);
    (async () => {
      const detail = await requestJourneyApi.detail(draftId);
      if (detail.draft.status === 'SUBMITTED' && detail.draft.submittedRequestId) {
        await requestJourneyApi.submittedRequest(detail.draft.submittedRequestId);
        if (active) { move('confirmed'); navigate(`${path}/confirmacao`, { replace: true }); }
        return;
      }
      const persisted = readIntent(accountId, draftId);
      if (persisted) { if (active) { const canRetry = detail.etag === persisted.etag && editable(detail); setIntent(persisted); setMessage('Existe uma intenção anterior. Consulte o estado antes de qualquer nova tentativa.'); move('check'); move(canRetry ? 'retryReady' : 'stale'); setRetryAllowed(canRetry); } return; }
      const definition = await requestJourneyApi.pinnedDefinition(draftId);
      if (!compatible(detail, definition) || !review || !editable(detail) || detail.draft.status !== 'READY_FOR_REVIEW' ||
          detail.draft.eligibilityResult != null && (detail.draft.eligibilityResult as {eligible?: boolean}).eligible !== true ||
          detail.etag !== review.etag || definition.declarationVersion !== review.declarationVersion || definition.schemaChecksum !== review.schemaChecksum) {
        if (active) { setMessage('A revisão ou a versão do rascunho mudou. Volte à revisão, valide novamente e aceite a declaração.'); move('stale'); }
        return;
      }
      if (active) { setEligibleToSend(true); setMessage('Revise a decisão de envio. O pedido só será enviado ao confirmar abaixo.'); }
    })().catch(() => {
      if (active) { setMessage('Não foi possível confirmar o estado. Consulte novamente; nenhum envio novo será iniciado.'); move('stale'); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; alive.current = false; };
  }, [accountId, draftId, navigate, path, reload, move, review]);

  async function check(wasConflict = false) {
    if (busy.current) return;
    busy.current = true; setRetryAllowed(false); move('check'); setMessage('A consultar o resultado no servidor...');
    try {
      const current = await requestJourneyApi.detail(draftId);
      if (current.draft.status === 'SUBMITTED' && current.draft.submittedRequestId) {
        await requestJourneyApi.submittedRequest(current.draft.submittedRequestId);
        if (alive.current) { move('confirmed'); navigate(`${path}/confirmacao`, { replace: true }); }
        return;
      }
      const saved = intent ?? readIntent(accountId, draftId);
      if (!saved || current.etag !== saved.etag || !editable(current)) {
        if (alive.current) { move('stale'); setMessage('O rascunho mudou ou a intenção não pode ser recuperada. Não crie outra chave; reconcilie o estado com suporte.'); }
      } else if (wasConflict) {
        if (alive.current) { move('stale'); setMessage('O servidor devolveu conflito. Consulte novamente antes de repetir a mesma intenção; nenhuma chave nova será criada.'); }
      } else if (alive.current) {
        move('retryReady'); setRetryAllowed(true);
        setMessage('O rascunho permanece editável. Isto não prova que o envio anterior falhou. Pode consultar de novo ou repetir manualmente a mesma intenção e o mesmo If-Match.');
      }
    } catch (cause) {
      if (alive.current) { move('uncertain'); setMessage(cause instanceof ApiError && cause.status === 401 ?
        'Sessão expirada. Entre novamente e consulte o estado; o envio não foi repetido.' :
        'Ainda não foi possível confirmar o pedido. A intenção continua guardada nesta aba.'); }
    } finally { busy.current = false; }
  }

  async function send() {
    if (busy.current || loading || !isUuid(accountId) || !isUuid(draftId) ||
        (!intent && (!review || !eligibleToSend)) || (intent && !retryAllowed)) return;
    busy.current = true; setRetryAllowed(false); setMessage(null);
    let currentIntent = intent;
    try {
      // Consultar antes de qualquer tentativa, inclusive replay manual. Um ETag
      // diferente exige nova revisão; nunca adaptar a intenção persistida.
      const draft = await requestJourneyApi.detail(draftId);
      if (draft.draft.status === 'SUBMITTED' && draft.draft.submittedRequestId) {
        await requestJourneyApi.submittedRequest(draft.draft.submittedRequestId);
        if (alive.current) { move('confirmed'); navigate(`${path}/confirmacao`, { replace: true }); }
        return;
      }
      const pinned = await requestJourneyApi.pinnedDefinition(draftId);
      const expected = currentIntent ?? review;
      if (!expected || !compatible(draft, pinned) || !editable(draft) ||
          (!currentIntent && draft.draft.status !== 'READY_FOR_REVIEW') ||
          draft.etag !== expected.etag || pinned.declarationVersion !== expected.declarationVersion || pinned.schemaChecksum !== expected.schemaChecksum ||
          pinned.eligibility instanceof Array && pinned.eligibility.length > 0 && (draft.draft.eligibilityResult as {eligible?:boolean}|null)?.eligible !== true) {
        if (alive.current) { move('stale'); setMessage('Os dados ou a declaração mudaram. Não foi enviado outro pedido; a intenção anterior permanece preservada.'); }
        return;
      }
      if (!currentIntent) {
        currentIntent = createIntent(accountId, draftId, review!.etag, review!.declarationVersion, review!.schemaChecksum);
        if (alive.current) setIntent(currentIntent);
      }
      if (alive.current) { move('send'); setMessage('A enviar pedido. Aguarde a confirmação do servidor.'); }
      const submitted = await requestJourneyApi.submit(draftId, currentIntent.etag, currentIntent.key, currentIntent.declarationVersion);
      if (alive.current) { move('confirmed'); navigate(`${path}/confirmacao`, { replace: true, state: { requestId: submitted.result.requestId } }); }
    } catch (cause) {
      if (alive.current) {
        if (!currentIntent) { move('stale'); setMessage('A intenção não pôde ser guardada; nenhum POST foi enviado.'); }
        else {
          // A falha pode ter acontecido depois do commit; o GET é obrigatório.
          setMessage('Resultado por confirmar. A consultar o rascunho...');
          busy.current = false;
          await check(cause instanceof ApiError && cause.status === 409);
          return;
        }
      }
    } finally { busy.current = false; }
  }

  return <RequestJourneyShell title="Submissão do pedido">
    {loading ? <p role="status" aria-busy="true">A confirmar o rascunho e a declaração...</p> : <div className="space-y-5">
      <p role="status" className="text-sm font-medium">Estado: {{preparing:'Preparação',sending:'Envio em curso',unknown:'Resultado por confirmar',checking:'A consultar',submitted:'Submetido',conflict:'Reconciliação necessária'}[phase]}</p>
      {message && <p role={phase === 'conflict' || phase === 'unknown' ? 'alert' : 'status'} className="border-l-4 border-primary p-4">{message}</p>}
      {phase === 'preparing' && eligibleToSend && <Button onClick={() => void send()}>Enviar pedido</Button>}
      {phase === 'unknown' && intent && <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => void check()}>Consultar resultado novamente</Button>
        {retryAllowed && <Button onClick={() => void send()}>Repetir a mesma intenção</Button>}</div>}
      {phase === 'conflict' && <div className="space-y-3"><Button variant="outline" onClick={() => void check()}>Consultar estado novamente</Button>
        {!intent && <Button variant="outline" onClick={() => { move('reconcile'); setReload(value => value + 1); }}>Verificar revisão novamente</Button>}</div>}
      {phase === 'sending' && <p role="status" aria-busy="true">O envio está em curso. Não feche esta página até confirmar o resultado, se possível.</p>}
      <Link className="block text-primary underline" to={path}>Voltar ao rascunho</Link>
    </div>}
  </RequestJourneyShell>;
}
