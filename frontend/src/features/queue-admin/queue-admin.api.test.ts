import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { assistedCheckIn, changeQueueStatus, createDesk } from './queue-admin.api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

describe('queue administration API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'assisted-key') });
    vi.mocked(api.post).mockResolvedValue({ success: true, data: { id: 'result' } });
  });

  it('uses optimistic concurrency for queue status changes', async () => {
    const queue = { id: 'queue-1', name: 'Atendimento', locationCode: 'BOANE', departmentId: 'dep-1', serviceId: null, mode: 'HYBRID' as const, status: 'CLOSED' as const, version: 8, desks: [] };
    await changeQueueStatus(queue, 'OPEN');
    expect(api.post).toHaveBeenCalledWith('/admin/queues/queue-1/status', { status: 'OPEN' }, { headers: { 'If-Match': '8' } });
  });

  it('creates a desk inside the selected queue', async () => {
    await createDesk('queue-1', { code: 'B01', displayName: 'Balcão 1' });
    expect(api.post).toHaveBeenCalledWith('/admin/queues/queue-1/desks', { code: 'B01', displayName: 'Balcão 1' });
  });

  it('protects assisted check-in retries with idempotency', async () => {
    await assistedCheckIn('appointment-1');
    expect(api.post).toHaveBeenCalledWith('/admin/appointments/appointment-1/check-in', undefined, { headers: { 'Idempotency-Key': 'assisted-key' } });
  });
});
