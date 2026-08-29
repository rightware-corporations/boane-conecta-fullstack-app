import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

export type PublicQueueCall = {
  ticketCode: string;
  deskDisplayName: string;
  callState: 'CALLED' | 'SERVING';
  calledAt: string;
};

export async function getPublicQueueDisplay(queueId: string): Promise<PublicQueueCall[]> {
  const response = await api.get<ApiResponse<PublicQueueCall[]>>(`/public/queues/${encodeURIComponent(queueId)}/display`);
  if (!response.success) throw new Error(response.message || 'Display indisponível.');
  return response.data || [];
}
