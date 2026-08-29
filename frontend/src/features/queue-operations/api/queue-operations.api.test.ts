import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { callNext, completeService, getQueueSnapshots, transferTicket } from './queue-operations.api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

describe('queue operations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'operation-key') });
    vi.mocked(api.get).mockResolvedValue({ success: true, data: [] });
    vi.mocked(api.post).mockResolvedValue({ success: true, data: { outcome: 'OK' } });
  });

  it('loads the staff-safe operational projection', async () => {
    await getQueueSnapshots();
    expect(api.get).toHaveBeenCalledWith('/admin/queues/snapshots');
  });

  it('protects call-next retries with an idempotency key', async () => {
    await callNext('queue-1', 'desk-1');
    expect(api.post).toHaveBeenCalledWith('/admin/queues/queue-1/desks/desk-1/call-next', undefined, { headers: { 'Idempotency-Key': 'operation-key' } });
  });

  it('sends an explicit service outcome', async () => {
    await completeService('session-1', 'CONCLUIDO');
    expect(api.post).toHaveBeenCalledWith('/admin/service-sessions/session-1/complete', { outcomeCode: 'CONCLUIDO' });
  });

  it('requires an explicit destination and reason for transfer', async () => {
    await transferTicket('ticket-1', 'queue-2', 'Serviço competente');
    expect(api.post).toHaveBeenCalledWith('/admin/queue-tickets/ticket-1/transfer', { destinationQueueId: 'queue-2', reason: 'Serviço competente' });
  });
});
