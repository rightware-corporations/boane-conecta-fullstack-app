import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { DraftEditStatus } from './DraftEditStatus';
import { parseDocumentRequirements } from './document-requirements';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { isVisible, parseEligibility, parseSteps } from './schema';
import type { DraftDetail, DraftDocument, DraftValidation } from './types';
import { useDraftDefinition } from './useDraftDefinition';

function display(value: unknown, choices?: {value:string;label:string}[]): string {
  if (value == null || value === '') return 'Não preenchido';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'string') return choices?.find(item => item.value === value)?.label ?? value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(item => display(item, choices)).join(', ');
  if (typeof value === 'object') return Object.values(value).filter(item => typeof item === 'string' && item).join(' · ') || 'Não preenchido';
  return 'Valor indisponível';
}

export default function RequestReviewPage() {
  const { draftId = '' } = useParams();
  const navigate = useNavigate();
  const { loading, error, detail, definition, retry } = useDraftDefinition(draftId);
  const [snapshot, setSnapshot] = useState<DraftDetail | null>(null);
  const [links, setLinks] = useState<DraftDocument[] | null>(null);
  const [validation, setValidation] = useState<DraftValidation | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!detail || !definition) return;
    let active = true;
    setSnapshot(detail); setValidation(null); setAccepted(false); setLinks(null); setUncertain(false);
    requestJourneyApi.draftDocuments(draftId).then(items => { if (active) setLinks(items); })
      .catch(() => { if (active) setMessage('Não foi possível carregar as associações documentais.'); });
    return () => { active = false; };
  }, [detail, definition, draftId]);
  let steps: ReturnType<typeof parseSteps> = []; let eligibility: ReturnType<typeof parseEligibility> = [];
  let requirements: ReturnType<typeof parseDocumentRequirements> = []; let invalid: string | null = null;
  if (definition) try {
    steps = parseSteps(definition.schema); eligibility = parseEligibility(definition.eligibility);
    requirements = parseDocumentRequirements(definition.documentRequirements);
    if (!definition.declarationVersion?.trim() || !definition.declarationText?.trim()) throw new Error('A declaração fixada não está disponível.');
  } catch (cause) { invalid = cause instanceof Error ? cause.message : 'Definição indisponível.'; }
  async function validate() {
    if (!snapshot || busy || uncertain) return;
    setBusy(true); setValidation(null); setAccepted(false); setMessage(null);
    try {
      const result = await requestJourneyApi.validate(draftId, snapshot.etag);
      setSnapshot(result.detail); setValidation(result.validation);
      setMessage(result.validation.valid ? 'Validação confirmada. Leia a declaração antes de prosseguir.' : 'A validação encontrou pendências. Consulte os erros abaixo.');
    } catch (cause) {
      setUncertain(true);
      setMessage(cause instanceof ApiError && cause.status === 409 ? 'O rascunho mudou. Consulte a versão actual antes de validar novamente.' : 'Resultado da validação desconhecido. Consulte a versão actual antes de tentar novamente.');
    } finally { setBusy(false); }
  }
  async function refresh() {
    try {
      const [fresh, freshLinks] = await Promise.all([requestJourneyApi.detail(draftId), requestJourneyApi.draftDocuments(draftId)]);
      setSnapshot(fresh); setLinks(freshLinks); setValidation(null); setAccepted(false); setUncertain(false);
      setMessage('Versão actual consultada. A validação e a aceitação devem ser repetidas.');
    } catch { setMessage('Não foi possível consultar a versão actual.'); }
  }
  const base = `/municipe/pedidos/rascunhos/${draftId}`;
  return <RequestJourneyShell title="Revisão do pedido" subtitle={definition?.serviceTitle}>
    <DraftEditStatus loading={loading} error={error} retry={retry} />
    {invalid && <p role="alert">{invalid} Os dados foram preservados.</p>}
    {message && <p role={uncertain || validation?.valid === false ? 'alert' : 'status'} className="my-4 border-l-4 border-primary p-3">{message}</p>}
    {uncertain && <Button variant="outline" onClick={refresh} disabled={busy}>Consultar versão actual</Button>}
    {snapshot && definition && !invalid && links && <div className="space-y-7">
      <section aria-labelledby="review-eligibility"><h2 id="review-eligibility" className="text-xl font-semibold">Elegibilidade</h2>
        <p>Resultado: {snapshot.draft.eligibilityResult == null ? 'Ainda não verificado' : (snapshot.draft.eligibilityResult as {eligible?: boolean}).eligible === true ? 'Elegível segundo os critérios publicados' : 'Elegibilidade não confirmada'}</p>
        <dl>{eligibility.map(rule => <div key={rule.key} className="border-b py-2"><dt className="font-medium">{rule.label}</dt><dd>{display(snapshot.draft.eligibilityAnswers[rule.key], rule.options)}</dd></div>)}</dl>
        <Link className="text-primary underline" to={`${base}/elegibilidade`}>Corrigir elegibilidade</Link></section>
      {steps.map(step => <section key={step.key} aria-label={step.title} className="space-y-2"><h2 className="text-xl font-semibold">{step.title}</h2>
        <dl>{step.fields.filter(field => isVisible(field, snapshot.draft.answers)).map(field => <div key={field.key} className="border-b py-2"><dt className="font-medium">{field.label}</dt><dd className="break-words">{field.type === 'ADDRESS' && field.addressFields ? field.addressFields.map(part => `${part.label}: ${display((snapshot.draft.answers[field.key] as Record<string, unknown> | undefined)?.[part.key])}`).join(' · ') : display(snapshot.draft.answers[field.key], field.options)}</dd></div>)}</dl>
        <Link className="text-primary underline" to={`${base}/formulario?step=${encodeURIComponent(step.key)}`}>Corrigir esta etapa</Link></section>)}
      <section aria-labelledby="review-documents"><h2 id="review-documents" className="text-xl font-semibold">Documentos</h2><dl>{requirements.map(item => <div key={item.key} className="border-b py-2"><dt className="font-medium">{item.title}</dt><dd>{links.find(link => link.requirementKey === item.key)?.originalFileName ?? 'Não associado'}</dd></div>)}</dl>
        <Link className="text-primary underline" to={`${base}/documentos`}>Corrigir documentos</Link></section>
      <section aria-labelledby="review-check" className="space-y-3"><h2 id="review-check" className="text-xl font-semibold">Validação</h2>
        <Button disabled={busy || uncertain} onClick={validate}>{busy ? 'A validar...' : 'Validar rascunho no servidor'}</Button>
        {validation && !validation.valid && <div role="alert"><p>Corrija as seguintes pendências:</p><ul className="list-disc pl-6">
          {[...validation.fieldErrors,...validation.documentErrors,...validation.globalErrors].map((item,index) => <li key={`${item.code}-${index}`}>{item.fieldKey || item.requirementKey || item.stepKey || 'Pedido'}: {item.message}</li>)}</ul></div>}
      </section>
      <section aria-labelledby="review-declaration" className="space-y-3"><h2 id="review-declaration" className="text-xl font-semibold">Declaração, versão {definition.declarationVersion}</h2>
        <p className="whitespace-pre-wrap break-words">{definition.declarationText}</p>
        <label className="flex min-h-11 items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={accepted} disabled={!validation?.valid || busy || uncertain}
          onChange={event => setAccepted(event.target.checked)} />Li e aceito a declaração apresentada nesta versão.</label>
        <p role="status">{validation?.valid && accepted ? 'Revisão concluída. Confirme o envio na próxima etapa.' : 'Valide o pedido e aceite a declaração para continuar.'}</p>
        <Button disabled={!validation?.valid || !accepted || busy || uncertain || snapshot.draft.status !== 'READY_FOR_REVIEW'}
          onClick={() => navigate(`${base}/submissao`, { state: { draftId, etag: snapshot.etag,
            declarationVersion: definition.declarationVersion, schemaChecksum: definition.schemaChecksum, accepted: true } })}>
          Continuar para submissão
        </Button>
      </section>
    </div>}
    <Link to={base} className="mt-6 block text-primary underline">Voltar ao rascunho</Link>
  </RequestJourneyShell>;
}
