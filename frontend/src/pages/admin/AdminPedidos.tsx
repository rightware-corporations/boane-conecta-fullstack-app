import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pendente: { label: 'Pendente', variant: 'outline' },
  em_processamento: { label: 'Em Processamento', variant: 'secondary' },
  concluido: { label: 'Concluído', variant: 'default' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
};

const paymentStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pendente: { label: 'Pendente', variant: 'outline' },
  processando: { label: 'Processando', variant: 'secondary' },
  pago: { label: 'Pago', variant: 'default' },
  falhado: { label: 'Falhado', variant: 'destructive' },
};

export default function AdminPedidos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { canManageServices } = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('service_requests')
        .update({
          status,
          ...(status === 'concluido' ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast({ title: 'Estado actualizado com sucesso' });
      setSelectedRequest(null);
    },
    onError: (error) => {
      toast({ title: 'Erro ao actualizar', description: error.message, variant: 'destructive' });
    },
  });

  const filteredRequests = requests?.filter((req) => {
    const matchesSearch =
      req.citizen_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Pedidos de Serviço" subtitle="Gestão de pedidos e pagamentos dos munícipes">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, serviço ou referência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_processamento">Em Processamento</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="text-2xl font-bold text-foreground">{requests?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total de pedidos</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="text-2xl font-bold text-foreground">
              {requests?.filter((r) => r.payment_status === 'pago').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Pagos</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="text-2xl font-bold text-foreground">
              {requests?.filter((r) => r.status === 'em_processamento').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Em processamento</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="text-2xl font-bold text-foreground">
              {requests?.filter((r) => r.status === 'concluido').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Concluídos</div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referência</TableHead>
                    <TableHead>Munícipe</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-xs">{req.payment_reference || '—'}</TableCell>
                      <TableCell>{req.citizen_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{req.service_name}</TableCell>
                      <TableCell>{Number(req.total_amount).toLocaleString('pt-MZ')} MZN</TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusLabels[req.payment_status]?.variant || 'outline'}>
                          {paymentStatusLabels[req.payment_status]?.label || req.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusLabels[req.status]?.variant || 'outline'}>
                          {statusLabels[req.status]?.label || req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(req.created_at), 'dd/MM/yyyy', { locale: pt })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!filteredRequests || filteredRequests.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredRequests?.map((req) => (
                <div key={req.id} className="rounded-xl bg-card p-4 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{req.payment_reference || '—'}</span>
                    <Badge variant={statusLabels[req.status]?.variant || 'outline'} className="text-xs">
                      {statusLabels[req.status]?.label || req.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{req.service_name}</p>
                    <p className="text-xs text-muted-foreground">{req.citizen_name}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">{Number(req.total_amount).toLocaleString('pt-MZ')} MZN</span>
                    <Badge variant={paymentStatusLabels[req.payment_status]?.variant || 'outline'} className="text-xs">
                      {paymentStatusLabels[req.payment_status]?.label || req.payment_status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(req.created_at), 'dd/MM/yyyy', { locale: pt })}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                  </div>
                </div>
              ))}
              {(!filteredRequests || filteredRequests.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado.</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Referência</div>
                  <div className="font-mono font-medium">{selectedRequest.payment_reference || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Data</div>
                  <div className="font-medium">
                    {format(new Date(selectedRequest.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="font-semibold text-foreground">Dados do Munícipe</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>{' '}
                    <span className="font-medium">{selectedRequest.citizen_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telemóvel:</span>{' '}
                    <span className="font-medium">{selectedRequest.citizen_phone}</span>
                  </div>
                  {selectedRequest.citizen_email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{selectedRequest.citizen_email}</span>
                    </div>
                  )}
                  {selectedRequest.citizen_nif && (
                    <div>
                      <span className="text-muted-foreground">NIF:</span>{' '}
                      <span className="font-medium">{selectedRequest.citizen_nif}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="font-semibold text-foreground">Detalhes do Serviço</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-muted-foreground">Serviço:</span>{' '}
                    <span className="font-medium">{selectedRequest.service_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>{' '}
                    <span className="font-bold text-primary">
                      {Number(selectedRequest.total_amount).toLocaleString('pt-MZ')} MZN
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Método:</span>{' '}
                    <span className="font-medium uppercase">{selectedRequest.payment_method || '—'}</span>
                  </div>
                </div>
              </div>

              {canManageServices && selectedRequest.status !== 'concluido' && selectedRequest.status !== 'cancelado' && (
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'concluido' })}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como Concluído
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'cancelado' })}
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
