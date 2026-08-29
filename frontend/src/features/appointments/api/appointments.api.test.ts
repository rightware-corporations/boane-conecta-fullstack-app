import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/lib/api';

import { cancelAppointment, checkIn, confirmHold, createHold, getAvailability, rescheduleAppointment } from './appointments.api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

describe('appointments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'command-id') });
    vi.mocked(api.post).mockResolvedValue({ success: true, data: { id: 'result' } });
  });

  it('encodes availability parameters', async () => {
    vi.mocked(api.get).mockResolvedValue({ success: true, data: { days: [] } });
    await getAvailability({ serviceId: 'service 1', locationCode: 'BOANE SEDE', from: '2026-08-28', to: '2026-08-28' });
    expect(api.get).toHaveBeenCalledWith('/citizen/appointments/availability?serviceId=service+1&locationCode=BOANE+SEDE&from=2026-08-28&to=2026-08-28');
  });

  it('protects hold creation with an idempotency key', async () => {
    await createHold('slot-1');
    expect(api.post).toHaveBeenCalledWith('/citizen/appointment-holds', { slotId: 'slot-1' }, { headers: { 'Idempotency-Key': 'command-id' } });
  });

  it('sends the server hold version during confirmation', async () => {
    await confirmHold({ holdId: 'hold-1', slotId: 'slot-1', expiresAt: '2026-08-28T12:00:00Z', version: 7 }, 'Emissão');
    expect(api.post).toHaveBeenCalledWith('/citizen/appointment-holds/hold-1/confirm', { reason: 'Emissão' }, { headers: { 'Idempotency-Key': 'command-id', 'If-Match': '7' } });
  });

  it('sends the appointment version during cancellation', async () => {
    await cancelAppointment({ id: 'appointment-1', appointmentNumber: 'APT-1', slotId: 'slot-1', serviceId: 'service-1', serviceName: 'Certidão', locationCode: 'BOANE', locationName: 'Balcão', startTime: null, endTime: null, departmentName: null, reason: null, status: 'CONFIRMED', slotStatus: null, version: 4, createdAt: '', updatedAt: '' }, 'Imprevisto');
    expect(api.post).toHaveBeenCalledWith('/citizen/appointments/appointment-1/cancel', { reason: 'Imprevisto' }, { headers: { 'Idempotency-Key': 'command-id', 'If-Match': '4' } });
  });

  it('atomically reschedules with both appointment and hold versions', async () => {
    const appointment = { id: 'appointment-1', appointmentNumber: 'APT-1', slotId: 'slot-1', serviceId: 'service-1', serviceName: 'Certidão', locationCode: 'BOANE', locationName: 'Balcão', startTime: null, endTime: null, departmentName: null, reason: null, status: 'CONFIRMED' as const, slotStatus: null, version: 4, createdAt: '', updatedAt: '' };
    const hold = { holdId: 'hold-2', slotId: 'slot-2', expiresAt: '2026-08-28T12:00:00Z', version: 9 };
    await rescheduleAppointment(appointment, hold);
    expect(api.post).toHaveBeenCalledWith('/citizen/appointments/appointment-1/reschedule', { holdId: 'hold-2', holdVersion: 9 }, { headers: { 'Idempotency-Key': 'command-id', 'If-Match': '4' } });
  });

  it('does not request camera access for manual check-in', async () => {
    await checkIn({ appointmentId: 'appointment-1', method: 'MANUAL_CODE', credential: 'private-code' });
    expect(api.post).toHaveBeenCalledWith('/citizen/appointments/appointment-1/check-in', { method: 'MANUAL_CODE', credential: 'private-code' }, { headers: { 'Idempotency-Key': 'command-id' } });
  });
});
