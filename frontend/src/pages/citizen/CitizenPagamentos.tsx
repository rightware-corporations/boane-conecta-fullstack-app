import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, CheckCircle2, Clock, XCircle, Receipt, ArrowRight } from 'lucide-react';
import type { Payment } from '@/types';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  paid: { label: 'Pago', variant: 'default' },
  failed: { label: 'Falhado', variant: 'destructive' },
  cancelled: { label: 'Cancelado', variant: 'outline' },
};

const methodLabels: Record<string, string> = {
  mpesa: 'M-Pesa',
  emola: 'e-Mola',
  visa: 'Visa',
  cash: 'Numerário',
  bank_transfer: 'Transferência',
};

export default function CitizenPagamentos() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetch() {
      const { data } = await citizenService.getPayments({ status: filter || undefined });
      if (data) setPayments(data);
      setLoading(false);
    }
    fetch();
  }, [filter]);

  const filters = ['', 'pending', 'paid', 'failed'];
  const filterLabels: Record<string, string> = { '': 'Todos', pending: 'Pendentes', paid: 'Pagos', failed: 'Falhados' };

  return (
    <CitizenLayout title="Pagamentos" subtitle="Histórico e pagamentos pendentes">
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm"
            onClick={() => { setFilter(f); setLoading(true); }}>
            {filterLabels[f]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map(payment => {
            const config = statusConfig[payment.status] || statusConfig.pending;
            return (
              <Card key={payment.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                    {payment.status === 'paid' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : payment.status === 'failed' ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{payment.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">Ref: {payment.reference}</span>
                      <span className="text-xs text-muted-foreground">
                        {payment.payment_method ? methodLabels[payment.payment_method] || payment.payment_method : ''}
                      </span>
                      <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(payment.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">{payment.amount.toLocaleString('pt-PT')} {payment.currency}</p>
                    {payment.status === 'pending' && (
                      <Button size="sm" className="mt-1">
                        Pagar <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {payment.receipt_url && payment.status === 'paid' && (
                      <Button size="sm" variant="ghost" className="mt-1">
                        <Receipt className="h-3 w-3 mr-1" /> Recibo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CitizenLayout>
  );
}