import type { MunicipalService, ServiceAudience, ServiceCatalogFilters, ServiceChannel } from '../types';

export const ALL_FILTER = 'all';

export const channelLabels = {
  online: 'Online',
  in_person: 'Presencial',
  informational: 'Informativo',
} as const;

export const audienceLabels = {
  citizen: 'Munícipes',
  business: 'Empresas',
  institution: 'Instituições',
  all: 'Todos os públicos',
} as const;

export const availabilityLabels = {
  available: 'Disponível',
  suspended: 'Suspenso',
  unavailable: 'Indisponível',
} as const;

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-MZ')
    .trim();
}

export function filterServices(
  services: MunicipalService[],
  filters: ServiceCatalogFilters,
): MunicipalService[] {
  const query = normalizeSearch(filters.search);

  return services.filter((service) => {
    const searchable = normalizeSearch([
      service.title,
      service.description,
      service.category,
      ...service.keywords,
    ].filter(Boolean).join(' '));

    return (
      (!query || searchable.includes(query)) &&
      (filters.category === ALL_FILTER || service.category === filters.category) &&
      (filters.channel === ALL_FILTER || service.channels.includes(filters.channel as ServiceChannel)) &&
      (filters.audience === ALL_FILTER || service.audiences.includes(filters.audience as ServiceAudience)) &&
      (filters.availability === ALL_FILTER || service.availability === filters.availability)
    );
  });
}

export function formatFee(service: MunicipalService): string {
  if (service.fees.length === 0) return 'Valor não publicado';
  if (service.fees.every((fee) => fee.amount === 0)) return 'Gratuito';

  const values = service.fees.filter((fee) => fee.amount > 0);
  if (values.length === 0) return 'Gratuito';

  const first = values[0];
  const formatted = new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: first.currency,
    maximumFractionDigits: 2,
  }).format(first.amount);
  return values.length > 1 ? `A partir de ${formatted}` : formatted;
}
