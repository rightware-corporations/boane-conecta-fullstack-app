import { describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api';
import { getPublicQueueDisplay } from './queue-display.api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));

describe('public queue display API', () => {
  it('uses only the public PII-safe projection', async () => {
    vi.mocked(api.get).mockResolvedValue({ success: true, data: [{ ticketCode: 'A001', deskDisplayName: 'Balcão 1', callState: 'CALLED', calledAt: '2026-08-28T10:00:00Z' }] });
    await expect(getPublicQueueDisplay('queue 1')).resolves.toHaveLength(1);
    expect(api.get).toHaveBeenCalledWith('/public/queues/queue%201/display');
  });
});
