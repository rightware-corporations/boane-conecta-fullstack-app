import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { QueueOperation, StaffQueueSnapshot } from '../types';

const key = () => crypto.randomUUID();
function data<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined || response.data === null) throw new Error(response.message || 'Operação indisponível.');
  return response.data;
}

export async function getQueueSnapshots(): Promise<StaffQueueSnapshot[]> {
  return data(await api.get<ApiResponse<StaffQueueSnapshot[]>>('/admin/queues/snapshots'));
}
export async function openDesk(queueId: string, deskId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queues/${queueId}/desks/${deskId}/open`));
}
export async function closeDesk(queueId: string, deskId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queues/${queueId}/desks/${deskId}/close`));
}
export async function callNext(queueId: string, deskId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queues/${queueId}/desks/${deskId}/call-next`, undefined, { headers: { 'Idempotency-Key': key() } }));
}
export async function recallTicket(ticketId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queue-tickets/${ticketId}/recall`));
}
export async function startService(ticketId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queue-tickets/${ticketId}/start-service`));
}
export async function completeService(sessionId: string, outcomeCode: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/service-sessions/${sessionId}/complete`, { outcomeCode }));
}
export async function markNoShow(ticketId: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queue-tickets/${ticketId}/no-show`));
}
export async function transferTicket(ticketId: string, destinationQueueId: string, reason: string): Promise<QueueOperation> {
  return data(await api.post<ApiResponse<QueueOperation>>(`/admin/queue-tickets/${ticketId}/transfer`, { destinationQueueId, reason }));
}
