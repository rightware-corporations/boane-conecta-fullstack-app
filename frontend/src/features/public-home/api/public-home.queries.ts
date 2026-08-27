import { useQuery } from '@tanstack/react-query';

import {
  getHomeAlerts,
  getHomeOpportunities,
  getHomeProjects,
  getHomeServices,
  getHomeUpdates,
} from '@/features/public-home/api/public-home.api';

export function useActiveAlerts() {
  return useQuery({
    queryKey: ['public-home', 'active-alerts'],
    queryFn: getHomeAlerts,
    staleTime: 60_000,
    select: (items) => items.slice(0, 3),
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ['public-home', 'featured-services'],
    queryFn: getHomeServices,
    staleTime: 5 * 60_000,
    select: (items) => items.slice(0, 6),
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['public-home', 'opportunities'],
    queryFn: getHomeOpportunities,
    staleTime: 5 * 60_000,
    select: (items) => items.slice(0, 3),
  });
}

export function useLocalUpdates() {
  return useQuery({
    queryKey: ['public-home', 'local-updates'],
    queryFn: getHomeUpdates,
    staleTime: 5 * 60_000,
    select: (items) => items.slice(0, 5),
  });
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ['public-home', 'projects'],
    queryFn: getHomeProjects,
    staleTime: 5 * 60_000,
    select: (items) => items.slice(0, 3),
  });
}
