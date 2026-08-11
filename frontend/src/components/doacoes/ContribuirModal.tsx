import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Smartphone, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ContribuirModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projeto: {
    id: number;
    titulo: string;
    arrecadado: number;
    meta: number;
    contribuintes: number;
  };
  onSuccess?: (projectId: number) => void;
}

const valorChips = [50, 100, 250, 500, 1000];
const metodos = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone },
  { id: 'emola', label: 'e-Mola', icon: Smartphone },
  { id: 'cartao', label: 'Cartão', icon: CreditCard },
] as const;

function formatMT(value: number) {
  return new Intl.NumberFormat('pt-MZ').format(value) + ' MT';
}

export function ContribuirModal({ open, onOpenChange, projeto, onSuccess }: ContribuirModalProps) {
  const [valor, setValor] = useState<number | ''>('');
  const [metodo, setMetodo] = useState<string>('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const percentagem = Math.round((projeto.arrecadado / projeto.meta) * 100);

  const needsPhone = metodo === 'mpesa' || metodo === 'emola';

  const handleSubmit = async () => {
    if (!valor || valor <= 0 || !metodo) return;
    if (needsPhone && !/^8[2-7]\d{7}$/.test(telefone)) {
      toast.error('Insira um número de telefone válido (ex: 84XXXXXXX)');
      return;
    }

    setLoading(true);
    // Simulated async contribution
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    toast.success('Contribuição registada com sucesso!', {
      description: `Obrigado pela sua contribuição de ${formatMT(Number(valor))} via ${metodo.toUpperCase()}.`,
    });

    onSuccess?.(projeto.id);
    onOpenChange(false);
    setValor('');
    setMetodo('');
    setTelefone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[92vw] sm:w-full max-h-[80dvh] overflow-y-auto rounded-2xl p-5 sm:p-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Heart className="h-5 w-5 text-primary shrink-0" />
            <span>Contribuir</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">{projeto.titulo}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 pb-2">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-foreground">{formatMT(projeto.arrecadado)}</span>
              <span className="text-muted-foreground">Meta: {formatMT(projeto.meta)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${percentagem}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{percentagem}% atingido · {projeto.contribuintes} contribuintes</p>
          </div>

          {/* Value chips */}
          <div className="space-y-2">
            <Label>Valor da contribuição (MT)</Label>
            <div className="flex flex-wrap gap-2">
              {valorChips.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValor(v)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium border transition-colors min-h-[44px]",
                    valor === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  {v.toLocaleString('pt-MZ')}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Outro valor..."
              value={valor === '' ? '' : valor}
              onChange={(e) => setValor(e.target.value ? Number(e.target.value) : '')}
              min={1}
              className="mt-2"
            />
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label>Método de pagamento</Label>
            <div className="grid grid-cols-3 gap-2">
              {metodos.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetodo(m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-colors min-h-[44px]",
                    metodo === m.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary"
                  )}
                >
                  <m.icon className="h-5 w-5" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phone number for mobile money */}
          {needsPhone && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label>Número de telemóvel</Label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  +258
                </span>
                <Input
                  className="rounded-l-none"
                  type="tel"
                  placeholder={metodo === 'mpesa' ? '84XXXXXXX / 85XXXXXXX' : '86XXXXXXX / 87XXXXXXX'}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  maxLength={9}
                />
              </div>
              <p className="text-xs text-muted-foreground">Insira o número da sua conta {metodo === 'mpesa' ? 'M-Pesa' : 'e-Mola'} para processar o pagamento.</p>
            </div>
          )}
          <Button
            className="w-full"
            size="lg"
            disabled={!valor || Number(valor) <= 0 || !metodo || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                A processar...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Confirmar Contribuição
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
