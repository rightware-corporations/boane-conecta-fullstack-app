import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

import { isUuid } from './types';
import type { DraftDetail, RequestDefinition, RequestDraft } from './types';

const draftsPath = '/citizen/request-drafts';

function dataOf<T>(response: ApiResponse<T>): T {
  if (!response?.success || response.data == null) throw new Error('Não foi possível confirmar os dados no servidor.');
  return response.data;
}

function requireUuid(value: string): void {
  if (!isUuid(value)) throw new Error('Identificador inválido.');
}

function draftResult(response: { body: ApiResponse<RequestDraft>; status: number; etag: string | null }, expectedStatus: number): DraftDetail {
  if (response.status !== expectedStatus || !response.etag) throw new Error('A resposta não confirmou a versão do rascunho.');
  const draft = dataOf(response.body);
  requireUuid(draft.id);
  return { draft, etag: response.etag };
}

export const requestJourneyApi = {
  async definition(serviceId: string): Promise<RequestDefinition> {
    requireUuid(serviceId);
    const response = await api.get<ApiResponse<RequestDefinition>>(`/citizen/services/${serviceId}/request-definition`);
    return dataOf(response);
  },
  async createOrResume(serviceId: string): Promise<DraftDetail> {
    requireUuid(serviceId);
    const response = await api.postWithMetadata<ApiResponse<RequestDraft>>(draftsPath, { serviceId, resumeExisting: true });
    const detail = draftResult(response, 201);
    if (detail.draft.serviceId !== serviceId) throw new Error('O rascunho devolvido não corresponde ao serviço.');
    return detail;
  },
  async list(): Promise<RequestDraft[]> {
    const drafts = dataOf(await api.get<ApiResponse<RequestDraft[]>>(draftsPath));
    if (!Array.isArray(drafts)) throw new Error('A lista de rascunhos é inválida.');
    return drafts;
  },
  async detail(draftId: string): Promise<DraftDetail> {
    requireUuid(draftId);
    const detail = draftResult(await api.getWithMetadata<ApiResponse<RequestDraft>>(`${draftsPath}/${draftId}`), 200);
    if (detail.draft.id !== draftId) throw new Error('O rascunho devolvido não corresponde ao endereço.');
    return detail;
  },
};
