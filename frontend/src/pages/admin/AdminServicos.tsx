import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Briefcase } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

type Envelope<T> = { success: boolean; data?: T; message?: string };
type Service = { id: string; name: string; description?: string | null; category?: string | null; status?: string; price?: string | null; duration?: string | null };

export default function AdminServicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get<Envelope<Service[]> | Service[]>('/admin/services');
        const data = response && typeof response === 'object' && 'success' in response ? response.data : response;
        setServices((data as Service[]) || []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Erro ao carregar serviços'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminLayout title="Gestão de Serviços" subtitle={`${services.length} serviços registados`}>
      {loading ? (
        <p className="text-muted-foreground">A carregar serviços...</p>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum serviço registado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="p-4 bg-card rounded-xl shadow-soft">
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{service.description || 'Sem descrição'}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 bg-muted rounded">{service.category || 'Geral'}</span>
                {service.price && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{service.price}</span>}
                {service.duration && <span className="text-muted-foreground">{service.duration}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
