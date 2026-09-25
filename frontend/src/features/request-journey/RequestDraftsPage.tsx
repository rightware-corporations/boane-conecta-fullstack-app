import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { RequestJourneyShell } from './RequestJourneyShell';
import { requestJourneyApi } from './request-journey.api';
import type { RequestDraft } from './types';

function dateLabel(value: string | null): string | null {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Intl.DateTimeFormat('pt-MZ', { dateStyle: 'medium' }).format(new Date(value));
}

export default function RequestDraftsPage() {
  const [drafts, setDrafts] = useState<RequestDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    requestJourneyApi.list().then(result => { if (active) setDrafts(result); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  return <RequestJourneyShell title="Meus rascunhos" subtitle="Pedidos ainda não submetidos">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
      <div><h2 className="text-xl font-semibold">Retomar um rascunho</h2><p className="mt-1 text-sm text-muted-foreground">A lista apresenta apenas rascunhos disponíveis para esta conta.</p></div>
      <Button variant="outline" asChild><Link to="/servicos">Consultar serviços</Link></Button>
    </div>
    {loading ? <p role="status" aria-busy="true" className="py-8">A carregar os seus rascunhos...</p>
      : error ? <div role="alert" className="my-6 border-l-4 border-destructive bg-surface p-4"><p>Não foi possível consultar os rascunhos.</p><Button variant="outline" className="mt-4" onClick={() => setReloadKey(key => key + 1)}>Tentar novamente</Button></div>
        : drafts.length === 0 ? <div className="py-10"><p>Não existem rascunhos disponíveis para retoma.</p><p className="mt-2 text-sm text-muted-foreground">Esta lista não inclui pedidos já submetidos nem rascunhos expirados.</p><Link to="/servicos" className="mt-4 inline-block text-primary underline">Ver serviços disponíveis</Link></div>
          : <ul className="divide-y divide-border border-y border-border">{drafts.map(draft => <li key={draft.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-5">
            <div className="min-w-0"><h3 className="font-semibold">Rascunho de pedido</h3><p className="text-sm text-muted-foreground">{draft.status === 'READY_FOR_REVIEW' ? 'Pronto para revisão' : 'Em curso'}{dateLabel(draft.lastSavedAt) ? ` · Guardado em ${dateLabel(draft.lastSavedAt)}` : ''}</p>{dateLabel(draft.expiresAt) && <p className="text-xs text-muted-foreground">Disponível até {dateLabel(draft.expiresAt)}</p>}</div>
            <Button variant="outline" asChild><Link to={`/municipe/pedidos/rascunhos/${draft.id}`}>Consultar rascunho</Link></Button>
          </li>)}</ul>}
  </RequestJourneyShell>;
}
