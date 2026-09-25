import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import { isUuid } from './types';
import type { DraftDetail, RequestDefinition } from './types';

type Resolution = { detail: DraftDetail; definition: RequestDefinition | null };

export default function RequestDraftResolverPage() {
  const { draftId = '' } = useParams();
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isUuid(draftId)) { setLoading(false); setError('Endereço de rascunho inválido.'); return; }
    let active = true;
    setLoading(true);
    setError(null);
    setResolution(null);
    (async () => {
      const detail = await requestJourneyApi.detail(draftId);
      let definition: RequestDefinition | null = null;
      if (detail.draft.status === 'IN_PROGRESS' || detail.draft.status === 'READY_FOR_REVIEW') {
        try { definition = await requestJourneyApi.definition(detail.draft.serviceId); } catch { /* Pinned definition unavailable or network failure: never render the current schema. */ }
      }
      if (active) setResolution({ detail, definition });
    })().catch(() => { if (active) setError('Este rascunho não está disponível ou não foi possível consultá-lo.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [draftId, reloadKey]);

  const draft = resolution?.detail.draft;
  const definition = resolution?.definition;
  const editable = draft && (draft.status === 'IN_PROGRESS' || draft.status === 'READY_FOR_REVIEW') && Date.parse(draft.expiresAt) > Date.now();
  const sameVersion = editable && definition?.serviceVersionId === draft.serviceVersionId && definition?.formVersionId === draft.formVersionId;

  return <RequestJourneyShell title="Consultar rascunho" subtitle={sameVersion ? definition?.serviceTitle : undefined}>
    {loading ? <p role="status" aria-busy="true">A verificar o rascunho...</p> : error ? <div role="alert" className="border-l-4 border-destructive bg-surface p-4"><p>{error}</p>{isUuid(draftId) && <Button variant="outline" className="mt-4" onClick={() => setReloadKey(key => key + 1)}>Tentar novamente</Button>}</div>
      : draft && <section aria-labelledby="draft-heading" className="space-y-4">
        <h2 id="draft-heading" className="text-xl font-semibold">Estado do rascunho</h2>
        {draft.status === 'SUBMITTED' && draft.submittedRequestId ? <div role="status"><p>Este rascunho já foi submetido.</p><Button asChild className="mt-4"><Link to={`/municipe/pedidos/${draft.submittedRequestId}`}>Ver pedido submetido</Link></Button></div>
          : !editable ? <p role="status">Este rascunho já não está disponível para edição. Os dados não serão alterados.</p>
            : !sameVersion ? <div role="alert" className="border-l-4 border-warning bg-surface p-4"><h3 className="font-semibold">Continuação indisponível</h3><p className="mt-2 text-sm leading-6">Não foi possível confirmar a definição fixada deste rascunho. Se uma nova versão foi publicada, as respostas antigas não serão apresentadas num formulário diferente. Nenhum dado foi alterado.</p><Button variant="outline" className="mt-4" onClick={() => setReloadKey(key => key + 1)}>Verificar novamente</Button></div>
              : <div role="status" className="space-y-3 border-l-4 border-primary bg-surface p-4"><h3 className="font-semibold">Rascunho disponível</h3><p className="text-sm leading-6">A versão publicada corresponde ao rascunho. As etapas de documentos, revisão e submissão ainda não estão disponíveis.</p><Button asChild><Link to={`/municipe/pedidos/rascunhos/${draftId}/elegibilidade`}>Verificar elegibilidade</Link></Button></div>}
        <div className="border-t border-border pt-5"><Link to="/municipe/pedidos/rascunhos" className="text-primary underline">Voltar aos rascunhos</Link></div>
      </section>}
  </RequestJourneyShell>;
}
