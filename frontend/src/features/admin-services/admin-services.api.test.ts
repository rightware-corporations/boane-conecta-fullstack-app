import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/lib/api';

import { adaptAdminService, getAdminServices } from './admin-services.api';
import type { MunicipalServiceResponse } from './types';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));

const transport: MunicipalServiceResponse = {
  id: 'service-1',
  departmentId: 'department-1',
  departmentName: 'Urbanização',
  title: 'Licença de construção',
  slug: 'licenca-construcao',
  description: 'Pedido de licença para obras.',
  processingTime: '15 dias úteis',
  status: 'PUBLISHED',
  requirements: [{
    id: 'requirement-1', serviceId: 'service-1', title: 'Planta', description: 'Planta aprovada',
    required: true, createdAt: '2026-08-01T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
  }],
  fees: [{
    id: 'fee-1', serviceId: 'service-1', title: 'Taxa administrativa', amount: 1250, currency: 'MZN',
    createdAt: '2026-08-01T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
  }],
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-02T10:00:00Z',
};

describe('admin services API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the real transport title, processing time and status', () => {
    expect(adaptAdminService(transport)).toMatchObject({
      title: 'Licença de construção', processingTime: '15 dias úteis', statusLabel: 'Publicado',
    });
  });

  it('maps nested requirements and fees without legacy fields', () => {
    const service = adaptAdminService(transport);
    expect(service.requirements).toEqual([{ id: 'requirement-1', title: 'Planta', description: 'Planta aprovada', required: true }]);
    expect(service.fees).toEqual([{ id: 'fee-1', title: 'Taxa administrativa', amount: 1250, currency: 'MZN' }]);
  });

  it('preserves optional transport fields as absent', () => {
    expect(adaptAdminService({ ...transport, departmentName: null, description: null, processingTime: null })).toMatchObject({
      departmentName: null, description: null, processingTime: null,
    });
  });

  it('requests the real admin endpoint and adapts the response', async () => {
    vi.mocked(api.get).mockResolvedValue({ success: true, data: [transport] });
    await expect(getAdminServices()).resolves.toEqual([expect.objectContaining({ id: 'service-1', title: 'Licença de construção' })]);
    expect(api.get).toHaveBeenCalledWith('/admin/services');
  });

  it('rejects unsuccessful envelopes and preserves transport errors', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ success: false, data: [], message: 'Indisponível' });
    await expect(getAdminServices()).rejects.toThrow('Indisponível');
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network failure'));
    await expect(getAdminServices()).rejects.toThrow('Network failure');
  });
});
