import { queryOptions } from '@tanstack/react-query';

import { getMunicipalService, getMunicipalServices } from './service-catalog.api';

export const serviceCatalogQuery = queryOptions({
  queryKey: ['public', 'services', 'catalog'],
  queryFn: getMunicipalServices,
  staleTime: 5 * 60 * 1000,
});

export function serviceDetailQuery(slug: string) {
  return queryOptions({
    queryKey: ['public', 'services', 'detail', slug],
    queryFn: () => getMunicipalService(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}
