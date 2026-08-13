import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ServiceCategoryFilter } from '@/components/services/ServiceCategoryFilter';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceDetailModal } from '@/components/services/ServiceDetailModal';
import { ServicePaymentDialog } from '@/components/services/ServicePaymentDialog';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: string | null;
  price: string | null;
  requirements: string | null;
  documents: string | null;
  icon: string | null;
  active: boolean;
}

type ApiResponse<T> = { success?: boolean; data?: T; message?: string };

const toService = (item: any): Service => ({
  id: String(item.id),
  name: item.name || item.title || 'Serviço municipal',
  description: item.description || null,
  category: item.category || item.departmentName || item.department?.name || 'Geral',
  duration: item.duration || item.processingTime || item.estimatedProcessingTime || null,
  price: item.price || item.baseFee || item.fee || null,
  requirements: Array.isArray(item.requirements)
    ? item.requirements.map((r: any) => r.description || r.name || r.title).filter(Boolean).join('\n')
    : item.requirements || null,
  documents: item.documents || null,
  icon: item.icon || null,
  active: item.active ?? item.status === 'ACTIVE' ?? true,
});

export default function Servicos() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentService, setPaymentService] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<any[]> | any[]>('/public/services');
      const data = Array.isArray(response) ? response : response.data || [];
      return data.map(toService).filter((service) => service.active);
    },
  });

  const filteredServices = services?.filter((service) => {
    const matchesCategory = activeCategory === 'todos' || service.category === activeCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const handlePay = () => {
    if (selectedService) {
      setPaymentService(selectedService);
      setSelectedService(null);
    }
  };

  return (
    <Layout>
      <section className="bg-primary py-16 lg:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-foreground lg:text-5xl">
              Serviços ao Munícipe
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Encontre informações e pague pelos serviços disponíveis no Conselho Municipal de Boane
            </p>
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Pesquisar serviços..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-0 bg-background py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground shadow-elevated focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container">
          <ServiceCategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices?.map((service) => (
                  <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
                ))}
              </div>
              {(!filteredServices || filteredServices.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {isLoading ? 'A carregar serviços...' : 'Nenhum serviço encontrado.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedService && (
        <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} onPay={handlePay} />
      )}
      <ServicePaymentDialog service={paymentService} open={!!paymentService} onClose={() => setPaymentService(null)} />
    </Layout>
  );
}
