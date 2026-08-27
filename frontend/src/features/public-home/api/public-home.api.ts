import { api } from '@/lib/api';
import type { Announcement, ApiResponse, NewsArticle, Project, Tender } from '@/types';

type PublicServiceDto = {
  id: string;
  departmentName?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  processingTime?: string | null;
};

export type HomeService = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  duration: string | null;
};

export async function getHomeServices(): Promise<HomeService[]> {
  const response = await api.get<ApiResponse<PublicServiceDto[]>>('/public/services');

  if (!response.success) {
    throw new Error(response.message || 'Unable to load public services');
  }

  return (response.data || []).map((service) => ({
    id: service.id,
    name: service.title,
    category: service.departmentName || 'Serviço municipal',
    description: service.description || null,
    duration: service.processingTime || null,
  }));
}

/*
 * Provisional F1 adapters. The current backend has no public contracts for
 * these domains yet. Returning no records keeps optional sections hidden and
 * avoids presenting legacy fixtures as validated municipal content.
 */
export async function getHomeAlerts(): Promise<Announcement[]> {
  return [];
}

export async function getHomeOpportunities(): Promise<Tender[]> {
  return [];
}

export async function getHomeUpdates(): Promise<NewsArticle[]> {
  return [];
}

export async function getHomeProjects(): Promise<Project[]> {
  return [];
}
