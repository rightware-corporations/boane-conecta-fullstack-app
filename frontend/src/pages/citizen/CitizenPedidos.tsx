import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, FileSearch } from 'lucide-react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { ServiceRequest } from '@/types';

const statusLabels: Record<string, string> = { DRAFT: 'Rascunho', SUBMITTED: 'Submetido', IN_REVIEW: 'Em análise', ACTION_REQUIRED: 'Ação necessária', APPROVED: 'Aprovado', REJECTED: 'Recusado', COMPLETED: 'Concluído', CANCELLED: 'Cancelado' };

export default function CitizenPedidos() {
  const [params, setParams] = useSearchParams();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const query = params.get('q') ?? '';
  const status = params.get('status') ?? '';
  useEffect(() => { citizenService.getRequests().then(result => { setRequests(result.data ?? []); setError(result.error); setLoading(false); }); }, []);
  const filtered = useMemo(() => requests.filter(request => (!query || `${request.title} ${request.serviceTitle} ${request.requestNumber}`.toLowerCase().includes(query.toLowerCase())) && (!status || request.status === status)), [query, requests, status]);
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };

  return <CitizenLayout title="Meus pedidos" subtitle="Consulte o estado e o próximo passo de cada pedido">
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end">
      <label className="flex-1 text-sm font-medium">Pesquisar<span className="relative mt-1 block"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={event => update('q', event.target.value)} placeholder="Referência, serviço ou título" /></span></label>
      <label className="text-sm font-medium">Estado<select className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={event => update('status', event.target.value)}><option value="">Todos</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <Button asChild><Link to="/servicos">Iniciar novo pedido</Link></Button>
    </div>
    {loading ? <div className="space-y-2">{[1,2,3].map(item => <Skeleton key={item} className="h-20" />)}</div>
      : error ? <div role="alert" className="border-l-4 border-destructive bg-destructive/5 p-4"><p className="font-medium">Não foi possível carregar os pedidos</p><p className="text-sm text-muted-foreground">{error}</p></div>
      : filtered.length === 0 ? <div className="py-14 text-center"><FileSearch className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><h2 className="font-semibold">Nenhum pedido encontrado</h2><p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou consulte os serviços disponíveis.</p></div>
      : <div className="divide-y divide-border border-y border-border">{filtered.map(request => <article key={request.id} className="grid gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{request.requestNumber}</p><h2 className="mt-1 font-semibold">{request.title || request.serviceTitle}</h2><p className="text-sm text-muted-foreground">{request.serviceTitle}</p></div><div className="md:text-right"><Badge variant={request.status === 'ACTION_REQUIRED' ? 'destructive' : 'secondary'}>{statusLabels[request.status] ?? request.status}</Badge><p className="mt-1 text-xs text-muted-foreground">Atualizado {new Date(request.updatedAt).toLocaleDateString('pt-PT')}</p></div><Button variant="ghost" size="sm" asChild><Link to={`/municipe/pedidos/${request.id}`}>Ver pedido <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></article>)}</div>}
  </CitizenLayout>;
}
