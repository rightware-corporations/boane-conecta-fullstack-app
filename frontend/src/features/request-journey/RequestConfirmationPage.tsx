import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { clearIntent } from './submission-intent';
import { isUuid } from './types';
import type { SubmittedRequestDetail } from './types';

export default function RequestConfirmationPage() {
  const { draftId = '' } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<SubmittedRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    if (!isUuid(draftId)) { setLoading(false); setError('Endereço de rascunho inválido.'); return; }
    let active = true;
    setRequest(null); setError(null); setLoading(true);
    (async () => {
      // A confirmação é reconstruída sempre do backend, inclusive após reload.
      const draft = await requestJourneyApi.detail(draftId);
      if (draft.draft.status !== 'SUBMITTED' || !draft.draft.submittedRequestId)
        throw new Error('Ainda não foi possível confirmar a submissão deste rascunho.');
      const confirmed = await requestJourneyApi.submittedRequest(draft.draft.submittedRequestId);
      if (active) {
        setRequest(confirmed);
        if (user?.id) clearIntent(user.id, draftId);
      }
    })().catch(() => { if (active) setError('Ainda não foi possível confirmar o pedido. Consulte o estado do rascunho novamente.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [draftId, user?.id, reload]);
  return <RequestJourneyShell title="Confirmação do pedido">
    {loading ? <p role="status" aria-busy="true">A consultar a confirmação no servidor...</p> : error ? <div role="alert" className="space-y-3 border-l-4 border-warning p-4">
      <p>{error}</p><Button variant="outline" onClick={() => setReload(value => value + 1)}>Consultar novamente</Button>
      <Link className="block text-primary underline" to={`/municipe/pedidos/rascunhos/${draftId}/submissao`}>Resolver submissão</Link>
    </div> : request && <section aria-labelledby="confirmation-heading" className="space-y-5">
      <h2 id="confirmation-heading" className="text-xl font-semibold">Pedido confirmado pelo servidor</h2>
      <dl className="space-y-3">
        <div><dt className="font-medium">Identificador</dt><dd className="break-all">{request.id}</dd></div>
        <div><dt className="font-medium">Referência</dt><dd className="select-text text-lg font-semibold">{request.reference}</dd></div>
        <div><dt className="font-medium">Estado</dt><dd>{request.statusLabel || request.status}</dd></div>
        <div><dt className="font-medium">Data de submissão registada</dt><dd><time dateTime={request.submittedAt}>{request.submittedAt.replace('T', ' ')}</time></dd></div>
      </dl>
      <Button asChild><Link to={`/municipe/pedidos/${request.id}`}>Ver pedido</Link></Button>
    </section>}
  </RequestJourneyShell>;
}
