import { Clock, CreditCard, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  requirements: string | null;
  documents: string | null;
  category: string;
}

interface ServiceDetailModalProps {
  service: Service;
  onClose: () => void;
  onPay: () => void;
}

function parseListField(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function ServiceDetailModal({ service, onClose, onPay }: ServiceDetailModalProps) {
  const requirements = parseListField(service.requirements);
  const documents = parseListField(service.documents);
  const hasPrice = service.price && service.price !== 'Gratuito' && service.price !== '0';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl shadow-elevated max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-fade-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
          {service.category}
        </div>

        <h2 className="text-2xl font-bold text-foreground">{service.name}</h2>
        {service.description && (
          <p className="mt-2 text-muted-foreground">{service.description}</p>
        )}

        <div className="mt-6 space-y-4">
          {service.duration && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Prazo estimado</div>
                <div className="font-medium text-foreground">{service.duration}</div>
              </div>
            </div>
          )}

          {service.price && (
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Custo</div>
                <div className="font-medium text-foreground">{service.price}</div>
              </div>
            </div>
          )}
        </div>

        {requirements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Requisitos</h3>
            <ul className="space-y-2">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Documentos necessários</h3>
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {hasPrice ? (
            <Button className="flex-1" onClick={onPay}>
              <CreditCard className="h-4 w-4" />
              Pagar Serviço
            </Button>
          ) : (
            <Button className="flex-1" variant="outline" disabled>
              {service.price === 'Gratuito' ? 'Serviço Gratuito' : 'Consultar valor'}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
