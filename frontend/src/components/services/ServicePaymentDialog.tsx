import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, CreditCard, CheckCircle, Loader2, AlertCircle, ArrowLeft, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

type Step = 'details' | 'method' | 'processing' | 'result';
type PaymentMethod = 'mpesa' | 'emola' | 'visa';

const paymentMethods: { id: PaymentMethod; name: string; icon: typeof Smartphone; description: string }[] = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Vodacom M-Pesa' },
  { id: 'emola', name: 'e-Mola', icon: Smartphone, description: 'Movitel e-Mola' },
  { id: 'visa', name: 'Visa / Cartão', icon: CreditCard, description: 'Cartão de débito/crédito' },
];

function parseAmount(price: string | null): number {
  if (!price) return 0;
  const match = price.match(/[\d,.]+/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 0;
}

export function ServicePaymentDialog({ service, open, onClose }: ServicePaymentDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('details');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenNif, setCitizenNif] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    reference?: string;
    message?: string;
    simulated?: boolean;
  } | null>(null);

  const amount = parseAmount(service?.price ?? null);

  const resetForm = () => {
    setStep('details');
    setCitizenName('');
    setCitizenPhone('');
    setCitizenEmail('');
    setCitizenNif('');
    setPaymentMethod(null);
    setPaymentPhone('');
    setResult(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDetailsSubmit = () => {
    if (!citizenName.trim() || !citizenPhone.trim()) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }
    setStep('method');
  };

  const handlePayment = async () => {
    if (!paymentMethod || !service) return;

    if (paymentMethod !== 'visa' && !paymentPhone.trim()) {
      toast({ title: 'Introduza o número de telemóvel para pagamento', variant: 'destructive' });
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          service_id: service.id,
          service_name: service.name,
          citizen_name: citizenName,
          citizen_phone: citizenPhone,
          citizen_email: citizenEmail || undefined,
          citizen_nif: citizenNif || undefined,
          payment_method: paymentMethod,
          phone_number: paymentMethod !== 'visa' ? paymentPhone : undefined,
          total_amount: amount,
        },
      });

      if (error) throw error;

      setResult({
        success: data.success,
        reference: data.payment_reference,
        message: data.message,
        simulated: data.simulated,
      });
      setStep('result');
    } catch (err) {
      console.error('Payment error:', err);
      setResult({
        success: false,
        message: (err as Error).message || 'Erro ao processar pagamento. Tente novamente.',
      });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyReference = () => {
    if (result?.reference) {
      navigator.clipboard.writeText(result.reference);
      toast({ title: 'Referência copiada!' });
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'details' && 'Dados do Requerente'}
            {step === 'method' && 'Método de Pagamento'}
            {step === 'processing' && 'Processando...'}
            {step === 'result' && (result?.success ? 'Pagamento Confirmado' : 'Erro no Pagamento')}
          </DialogTitle>
          <DialogDescription>
            {service.name} — {service.price}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Citizen Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telemóvel *</Label>
              <Input
                id="phone"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="258 84 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nif">NIF / NUIT (opcional)</Label>
              <Input
                id="nif"
                value={citizenNif}
                onChange={(e) => setCitizenNif(e.target.value)}
                placeholder="Número de identificação fiscal"
              />
            </div>
            <Button className="w-full" onClick={handleDetailsSubmit}>
              Continuar para pagamento
            </Button>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 'method' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    if (method.id !== 'visa') {
                      setPaymentPhone(citizenPhone);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    method.id === 'mpesa' ? "bg-destructive/10 text-destructive" :
                    method.id === 'emola' ? "bg-accent/20 text-accent-foreground" :
                    "bg-secondary/10 text-secondary"
                  )}>
                    <method.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{method.name}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {paymentMethod && paymentMethod !== 'visa' && (
              <div className="space-y-2">
                <Label htmlFor="paymentPhone">Número {paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'}</Label>
                <Input
                  id="paymentPhone"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  placeholder="258 84 123 4567"
                />
              </div>
            )}

            {paymentMethod && (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviço</span>
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Total a pagar</span>
                  <span className="font-bold text-primary text-lg">{amount.toLocaleString('pt-MZ')} MZN</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={!paymentMethod}
              >
                Pagar agora
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              A processar o seu pagamento via {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'emola' ? 'e-Mola' : 'Visa'}...
            </p>
            <p className="text-sm text-muted-foreground">
              {paymentMethod !== 'visa' && 'Verifique o seu telemóvel para confirmar.'}
            </p>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && result && (
          <div className="py-4 space-y-4">
            <div className="text-center">
              {result.success ? (
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              )}
              <p className="text-foreground font-medium">{result.message}</p>
              {result.simulated && (
                <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-lg p-2">
                  ⚠️ Modo de simulação — APIs de pagamento ainda não configuradas
                </p>
              )}
            </div>

            {result.reference && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Referência do pedido</div>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-primary flex-1">
                    {result.reference}
                  </code>
                  <Button variant="ghost" size="sm" onClick={copyReference}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Guarde esta referência para acompanhar o seu pedido.
                </p>
              </div>
            )}

            <Button className="w-full" onClick={handleClose}>
              {result.success ? 'Concluir' : 'Tentar novamente'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
