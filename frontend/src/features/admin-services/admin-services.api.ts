import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

import type { AdminService, MunicipalServiceResponse, MunicipalServiceStatus } from './types';

const statusLabels: Record<MunicipalServiceStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
};

export function adaptAdminService(service: MunicipalServiceResponse): AdminService {
  return {
    id: service.id,
    departmentName: service.departmentName,
    title: service.title,
    slug: service.slug,
    description: service.description,
    processingTime: service.processingTime,
    status: service.status,
    statusLabel: statusLabels[service.status],
    requirements: service.requirements.map((requirement) => ({
      id: requirement.id,
      title: requirement.title,
      description: requirement.description,
      required: requirement.required,
    })),
    fees: service.fees.map((fee) => ({
      id: fee.id,
      title: fee.title,
      amount: fee.amount,
      currency: fee.currency,
    })),
    updatedAt: service.updatedAt,
  };
}

export async function getAdminServices(): Promise<AdminService[]> {
  const response = await api.get<ApiResponse<MunicipalServiceResponse[]>>('/admin/services');
  if (!response.success) throw new Error(response.message || 'Não foi possível carregar os serviços.');
  return response.data.map(adaptAdminService);
}
