import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

import { isUuid } from './types';
import type { CitizenDocument, DraftDetail, DraftDocument, DraftValidation, RequestDefinition, RequestDraft, SubmissionResponse, SubmittedRequestDetail } from './types';

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
  async pinnedDefinition(draftId: string): Promise<RequestDefinition> {
    requireUuid(draftId);
    return dataOf(await api.get<ApiResponse<RequestDefinition>>(`${draftsPath}/${draftId}/definition`));
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
  async saveEligibility(draftId: string, etag: string, answers: Record<string, unknown>): Promise<DraftDetail> {
    requireUuid(draftId);
    const detail = draftResult(await api.putWithMetadata<ApiResponse<RequestDraft>>(`${draftsPath}/${draftId}/eligibility`, { answers }, { headers: { 'If-Match': etag } }), 200);
    if (detail.draft.id !== draftId) throw new Error('O rascunho devolvido não corresponde ao endereço.');
    return detail;
  },
  async saveAnswers(draftId: string, etag: string, stepKey: string, answers: Record<string, unknown>): Promise<DraftDetail> {
    requireUuid(draftId);
    const detail = draftResult(await api.patchWithMetadata<ApiResponse<RequestDraft>>(`${draftsPath}/${draftId}/answers`, { stepKey, answers }, { headers: { 'If-Match': etag } }), 200);
    if (detail.draft.id !== draftId) throw new Error('O rascunho devolvido não corresponde ao endereço.');
    return detail;
  },
  async draftDocuments(draftId: string): Promise<DraftDocument[]> {
    requireUuid(draftId);
    const result = dataOf(await api.get<ApiResponse<DraftDocument[]>>(`${draftsPath}/${draftId}/documents`));
    if (!Array.isArray(result)) throw new Error('A lista de documentos é inválida.');
    return result;
  },
  async citizenDocuments(): Promise<CitizenDocument[]> {
    const result = dataOf(await api.get<ApiResponse<CitizenDocument[]>>('/citizen/documents'));
    if (!Array.isArray(result)) throw new Error('A lista de documentos é inválida.');
    return result;
  },
  async document(documentId: string): Promise<CitizenDocument> {
    requireUuid(documentId);
    return dataOf(await api.get<ApiResponse<CitizenDocument>>(`/citizen/documents/${documentId}`));
  },
  async upload(file: File): Promise<CitizenDocument> {
    const data = new FormData(); data.append('file', file);
    const response = await api.uploadWithMetadata<ApiResponse<CitizenDocument>>('/citizen/documents', data);
    if (response.status !== 201) throw new Error('O envio não foi confirmado.');
    const document = dataOf(response.body);
    requireUuid(document.id);
    return document;
  },
  async attach(draftId: string, requirementKey: string, documentId: string, etag: string): Promise<DraftDetail> {
    requireUuid(draftId); requireUuid(documentId);
    const response = await api.putWithMetadata<ApiResponse<{draft:RequestDraft; document:DraftDocument}>>(`${draftsPath}/${draftId}/documents/${encodeURIComponent(requirementKey)}`, { documentId }, { headers: { 'If-Match': etag } });
    return draftResult({ ...response, body: { ...response.body, data: response.body.data?.draft } }, 200);
  },
  async detach(draftId: string, requirementKey: string, etag: string): Promise<DraftDetail> {
    requireUuid(draftId);
    const response = await api.deleteWithMetadata<ApiResponse<{draft:RequestDraft; document:DraftDocument}>>(`${draftsPath}/${draftId}/documents/${encodeURIComponent(requirementKey)}`, { headers: { 'If-Match': etag } });
    return draftResult({ ...response, body: { ...response.body, data: response.body.data?.draft } }, 200);
  },
  async validate(draftId: string, etag: string): Promise<{ validation: DraftValidation; detail: DraftDetail }> {
    requireUuid(draftId);
    const response = await api.postWithMetadata<ApiResponse<DraftValidation>>(`${draftsPath}/${draftId}/validate`, undefined, { headers: { 'If-Match': etag } });
    if (response.status !== 200 || !response.etag) throw new Error('A validação não confirmou a versão do rascunho.');
    const validation = dataOf(response.body);
    if (validation.draft.id !== draftId) throw new Error('A validação não corresponde ao rascunho.');
    return { validation, detail: { draft: validation.draft, etag: response.etag } };
  },
  async submit(draftId: string, etag: string, idempotencyKey: string, declarationVersion: string): Promise<{ result: SubmissionResponse; status: 200 | 201 }> {
    requireUuid(draftId);
    if (!isUuid(idempotencyKey) || !declarationVersion.trim() || !etag) throw new Error('A intenção de submissão é inválida.');
    const response = await api.postWithMetadata<ApiResponse<SubmissionResponse>>(`${draftsPath}/${draftId}/submit`,
      { declarationVersion, declarationAccepted: true }, { headers: { 'If-Match': etag, 'Idempotency-Key': idempotencyKey } });
    if (response.status !== 201 && response.status !== 200) throw new Error('A submissão não foi confirmada.');
    const result = dataOf(response.body);
    requireUuid(result.requestId);
    if (!result.reference?.trim() || !result.status?.trim() || !result.submittedAt?.trim() ||
        result.replayed !== (response.status === 200)) throw new Error('A resposta de submissão é inconsistente.');
    return { result, status: response.status };
  },
  async submittedRequest(requestId: string): Promise<SubmittedRequestDetail> {
    requireUuid(requestId);
    const result = dataOf(await api.get<ApiResponse<SubmittedRequestDetail>>(`/citizen/requests/${requestId}`));
    if (result.id !== requestId || !result.reference?.trim() || !result.status?.trim() || !result.submittedAt?.trim())
      throw new Error('O pedido confirmado não corresponde ao rascunho.');
    return result;
  },
};
