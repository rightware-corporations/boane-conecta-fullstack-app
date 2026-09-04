import { useCallback, useEffect, useState } from 'react';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { OperationalEmpty, OperationalError, OperationalLoading } from '@/design-system/components/operational-state';
import { getAdminServices } from '@/features/admin-services/admin-services.api';
import type { AdminService } from '@/features/admin-services/types';
import { formatCurrency, formatDateTime } from '@/lib/formatters';

export default function AdminServicos() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setServices(await getAdminServices());
    } catch {
      setError('Não foi possível carregar os serviços municipais.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  return (
    <AdminLayout
      title="Serviços municipais"
      subtitle={`${services.length} ${services.length === 1 ? 'serviço registado' : 'serviços registados'}`}
      shell="operations"
    >
      {loading ? (
        <OperationalLoading label="A carregar serviços municipais…" />
      ) : error ? (
        <OperationalError title="Não foi possível carregar os serviços" description={error} retry={() => void loadServices()} />
      ) : services.length === 0 ? (
        <OperationalEmpty title="Nenhum serviço registado" description="O catálogo municipal ainda não contém serviços." />
      ) : (
        <ul className="divide-y rounded-lg border bg-surface" aria-label="Serviços municipais">
          {services.map((service) => (
            <li key={service.id} className="p-4 xsm:p-5 tb:p-6">
              <article>
                <div className="flex flex-col gap-3 tb:flex-row tb:items-start tb:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {service.departmentName || 'Departamento não informado'}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-foreground tb:text-lg">{service.title}</h2>
                    {service.description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{service.description}</p>}
                  </div>
                  <Badge variant="outline" className="w-fit shrink-0">{service.statusLabel}</Badge>
                </div>

                <dl className="mt-4 grid gap-3 text-sm tb:grid-cols-2">
                  {service.processingTime && <div><dt className="font-medium">Prazo de processamento</dt><dd className="mt-1 text-muted-foreground">{service.processingTime}</dd></div>}
                  <div><dt className="font-medium">Última atualização</dt><dd className="mt-1 text-muted-foreground">{formatDateTime(service.updatedAt)}</dd></div>
                </dl>

                {(service.requirements.length > 0 || service.fees.length > 0) && (
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {service.requirements.length > 0 && (
                      <section aria-labelledby={`requirements-${service.id}`}>
                        <h3 id={`requirements-${service.id}`} className="text-sm font-semibold">Requisitos</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                          {service.requirements.map((requirement) => (
                            <li key={requirement.id}>
                              <span className="font-medium">{requirement.title}</span>
                              {requirement.required && <span className="text-danger"> — obrigatório</span>}
                              {requirement.description && <p className="text-muted-foreground">{requirement.description}</p>}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {service.fees.length > 0 && (
                      <section aria-labelledby={`fees-${service.id}`}>
                        <h3 id={`fees-${service.id}`} className="text-sm font-semibold">Taxas</h3>
                        <dl className="mt-2 space-y-2 text-sm">
                          {service.fees.map((fee) => (
                            <div key={fee.id} className="flex items-baseline justify-between gap-4">
                              <dt>{fee.title}</dt>
                              <dd className="font-medium">{fee.currency === 'MZN' ? formatCurrency(fee.amount) : `${fee.amount} ${fee.currency}`}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    )}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}
