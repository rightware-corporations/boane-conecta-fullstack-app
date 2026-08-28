import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { CitizenRequestDetail } from '@/types';

export default function CitizenPedidoDetalhe() {
  const { id = '' } = useParams(); const [request, setRequest] = useState<CitizenRequestDetail>(); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(true);
  useEffect(() => { citizenService.getRequest(id).then(result => { setRequest(result.data); setError(result.error); setLoading(false); }); }, [id]);
  return <CitizenLayout title="Detalhe do pedido" subtitle="Estado, próximos passos e histórico público"><Button variant="ghost" size="sm" className="mb-4" asChild><Link to="/municipe/pedidos"><ArrowLeft className="mr-1 h-4 w-4" />Voltar aos pedidos</Link></Button>
    {loading ? <Skeleton className="h-72" /> : error || !request ? <div role="alert" className="border-l-4 border-destructive p-4">{error || 'Pedido não encontrado'}</div> : <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]"><main><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{request.reference}</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold">{request.title}</h2><Badge>{request.statusLabel}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{request.serviceTitle}</p><section className="mt-8"><h3 className="font-semibold">Histórico</h3><ol className="mt-4 border-l border-border pl-5">{request.timeline.map((entry, index) => <li key={`${entry.status}-${entry.occurredAt}-${index}`} className="relative pb-6"><span className="absolute -left-[1.55rem] top-1 h-2 w-2 rounded-full bg-primary" /><p className="font-medium">{entry.label}</p><time className="text-xs text-muted-foreground">{new Date(entry.occurredAt).toLocaleString('pt-PT')}</time></li>)}</ol></section></main><aside className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6"><h3 className="font-semibold">Próximo passo</h3><p className="mt-2 text-sm text-muted-foreground">{request.nextAction}</p>{request.documents.length > 0 && <div className="mt-6"><h3 className="font-semibold">Documentos</h3><ul className="mt-2 space-y-2">{request.documents.map(document => <li key={document.id} className="flex gap-2 text-sm"><FileText className="h-4 w-4" />{document.title}</li>)}</ul></div>}</aside></div>}
  </CitizenLayout>;
}
