import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string | null;
}

interface ServicePaymentDialogProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

export function ServicePaymentDialog({ service, open, onClose }: ServicePaymentDialogProps) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento do Serviço</DialogTitle>
          <DialogDescription>{service.name} — {service.price ?? 'Valor sob consulta'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">Pagamento online temporariamente indisponível</p>
              <p className="text-sm text-muted-foreground">
                Esta função será ligada ao módulo real de pagamentos do backend. Nenhum mock, Supabase ou gateway externo está a ser usado.
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
