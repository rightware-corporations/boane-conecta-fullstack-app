import { Clock, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    duration: string | null;
    price: string | null;
  };
  onClick: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      className="group rounded-xl bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-elevated cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      {service.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {service.description}
        </p>
      )}
      <div className="mt-4 flex items-center gap-4 text-sm">
        {service.duration && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {service.duration}
          </span>
        )}
        {service.price && (
          <span className="font-medium text-primary">
            {service.price}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Ver detalhes e pagar
        <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </div>
  );
}
