import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';

import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { isUuid } from './types';
import type { RequestDefinition, RequestDraft } from './types';

type StartPhase = 'idle' | 'sending' | 'checking' | 'uncertain';

export default function RequestStartPage() {
  const { serviceId = '' } = useParams();
  const navigate = useNavigate();
  const [definition, setDefinition] = useState<RequestDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [phase, setPhase] = useState<StartPhase>('idle');
  const [matches, setMatches] = useState<RequestDraft[]>([]);
  const [recoveryError, setRecoveryError] = useState(false);
  const sending = useRef(false);

  useEffect(() => {
    if (!isUuid(serviceId)) { setLoading(false); setLoadError('Endereço de serviço inválido.'); return; }
    let active = true;
    setLoading(true);
    setLoadError(null);
    requestJourneyApi.definition(serviceId).then(result => {
      if (!active) return;
      if (result.serviceId !== serviceId || result.status !== 'PUBLISHED' || !result.onlineSubmissionEnabled) {
        setLoadError('A submissão digital deste serviço não está disponível.');
      } else setDefinition(result);
    }).catch(error => { if (active) setLoadError(error instanceof ApiError && error.status === 403
      ? 'Não tem permissão para iniciar este serviço.'
      : 'A submissão digital deste serviço não está disponível ou não foi possível consultá-la.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [serviceId, reloadKey]);

  async function checkDrafts() {
    setPhase('checking');
    setRecoveryError(false);
    try {
      const drafts = await requestJourneyApi.list();
      setMatches(drafts.filter(draft => draft.serviceId === serviceId));
    } catch { setRecoveryError(true); }
    setPhase('uncertain');
  }

  async function start() {
    if (!definition || sending.current || phase !== 'idle') return;
    sending.current = true;
    setPhase('sending');
    try {
      const result = await requestJourneyApi.createOrResume(serviceId);
      navigate(`/municipe/pedidos/rascunhos/${result.draft.id}`);
    } catch (error) {
      // A lost response or a 401 after a POST does not prove the draft was not created.
      if (error instanceof ApiError && [400, 403, 404].includes(error.status)) {
        setLoadError(error.status === 403 ? 'Não tem permissão para iniciar este serviço.' : 'A submissão digital deste serviço não está disponível.');
        setPhase('idle');
      } else await checkDrafts();
    } finally { sending.current = false; }
  }

  return <RequestJourneyShell title="Iniciar pedido" subtitle={definition?.serviceTitle}>
    {loading ? <p role="status" aria-busy="true">A verificar a disponibilidade do serviço...</p>
      : loadError ? <div role="alert" className="border-l-4 border-destructive bg-surface p-4"><p>{loadError}</p><Button variant="outline" className="mt-4" onClick={() => setReloadKey(key => key + 1)}>Consultar novamente</Button></div>
        : definition && <section aria-labelledby="start-heading">
          <h2 id="start-heading" className="break-words text-xl font-semibold">{definition.serviceTitle}</h2>
          {definition.serviceDescription && <p className="mt-3 break-words leading-7 text-muted-foreground">{definition.serviceDescription}</p>}
          {phase === 'idle' && <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-5">
            <Button onClick={start}>Iniciar ou retomar rascunho</Button>
            <Button variant="outline" asChild><Link to="/municipe/pedidos/rascunhos">Ver rascunhos</Link></Button>
          </div>}
          {(phase === 'sending' || phase === 'checking') && <p role="status" aria-busy="true" className="mt-6">{phase === 'sending' ? 'A confirmar o rascunho no servidor...' : 'A consultar os seus rascunhos...'}</p>}
          {phase === 'uncertain' && <div role="alert" className="mt-6 border-l-4 border-warning bg-surface p-4">
            <h3 className="font-semibold">Resultado ainda por confirmar</h3>
            <p className="mt-2 text-sm leading-6">Não sabemos se a operação concluiu. Não será enviado outro pedido de criação automaticamente.</p>
            {matches.length > 0 && <ul className="mt-3 space-y-2">{matches.map(draft => <li key={draft.id}><Link className="text-primary underline" to={`/municipe/pedidos/rascunhos/${draft.id}`}>Consultar rascunho guardado</Link></li>)}</ul>}
            {recoveryError && <p className="mt-2 text-sm">Não foi possível confirmar a lista neste momento.</p>}
            <Button variant="outline" className="mt-4" onClick={checkDrafts}>Consultar a lista novamente</Button>
            <Button variant="ghost" asChild><Link to="/municipe/pedidos/rascunhos">Abrir meus rascunhos</Link></Button>
          </div>}
        </section>}
  </RequestJourneyShell>;
}
