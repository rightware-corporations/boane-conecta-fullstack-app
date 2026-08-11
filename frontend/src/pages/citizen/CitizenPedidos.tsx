import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ServiceRequest } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  submitted: { label: 'Submetido', variant: 'secondary', icon: Clock },
  processing: { label: 'Em Processamento', variant: 'default', icon: AlertCircle },
  approved: { label: 'Aprovado', variant: 'default', icon: CheckCircle2 },
  rejected: { label: 'Rejeitado', variant: 'destructive', icon: XCircle },
  completed: { label: 'Concluído', variant: 'default', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', variant: 'outline', icon: XCircle },
};

export default function CitizenPedidos() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await citizenService.getRequests({ status: statusFilter || undefined });
      if (data) setRequests(data);
      setLoading(false);
    }
    fetch();
  }, [statusFilter]);

  const filtered = requests.filter(r =>
    !search || r.service_name.toLowerCase().includes(search.toLowerCase()) || r.reference_number.includes(search)
  );

  const statusFilters = ['', 'submitted', 'processing', 'approved', 'completed', 'rejected'];

  return (
    <CitizenLayout title="Meus Pedidos" subtitle="Acompanhe os seus pedidos de serviço">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome do serviço ou referência..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(s); setLoading(true); }}
            >
              {s ? statusConfig[s]?.label || s : 'Todos'}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(request => {
            const config = statusConfig[request.status] || statusConfig.submitted;
            const StatusIcon = config.icon;
            return (
              <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(request)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{request.service_name}</p>
                        <Badge variant={config.variant} className="text-[10px] flex-shrink-0">
                          <StatusIcon className="h-3 w-3 mr-1" />{config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Ref: {request.reference_number}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Submetido em {new Date(request.submitted_at).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold">{request.total_amount.toLocaleString('pt-PT')} MZN</p>
                      <Badge variant={request.payment_status === 'paid' ? 'default' : 'secondary'} className="text-[10px] mt-1">
                        {request.payment_status === 'paid' ? 'Pago' : request.payment_status === 'pending' ? 'Pendente' : request.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhe do Pedido</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Serviço:</span><p className="font-medium">{selected.service_name}</p></div>
                <div><span className="text-muted-foreground">Referência:</span><p className="font-medium">{selected.reference_number}</p></div>
                <div><span className="text-muted-foreground">Estado:</span><Badge variant={statusConfig[selected.status]?.variant}>{statusConfig[selected.status]?.label}</Badge></div>
                <div><span className="text-muted-foreground">Valor:</span><p className="font-medium">{selected.total_amount.toLocaleString('pt-PT')} MZN</p></div>
                <div><span className="text-muted-foreground">Pagamento:</span><Badge variant={selected.payment_status === 'paid' ? 'default' : 'secondary'}>{selected.payment_status}</Badge></div>
                <div><span className="text-muted-foreground">Data:</span><p className="font-medium">{new Date(selected.submitted_at).toLocaleDateString('pt-PT')}</p></div>
              </div>
              {selected.notes && (
                <div><span className="text-sm text-muted-foreground">Notas:</span><p className="text-sm mt-1">{selected.notes}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </CitizenLayout>
  );
}