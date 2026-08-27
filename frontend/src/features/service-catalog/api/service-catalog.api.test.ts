import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/lib/api';

import { getMunicipalService, getMunicipalServices, toMunicipalService } from './service-catalog.api';

vi.mock('@/lib/api', () => ({
  api: { get: vi.fn() },
}));

const dto = {
  id: 'service-1',
  title: 'Certidão municipal',
  slug: 'certidao-municipal',
  departmentName: 'Atendimento',
  description: 'Emissão de certidão',
  processingTime: '5 dias úteis',
  status: 'PUBLISHED',
  requirements: [{ id: 'r1', title: 'Identificação', required: true }],
  fees: [{ id: 'f1', title: 'Emissão', amount: 100, currency: 'MZN' }],
};

describe('service catalog API adapter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the current backend contract without fabricating channels or audiences', () => {
    const service = toMunicipalService(dto);
    expect(service.slug).toBe('certidao-municipal');
    expect(service.category).toBe('Atendimento');
    expect(service.channels).toEqual([]);
    expect(service.audiences).toEqual([]);
    expect(service.requirements[0].title).toBe('Identificação');
  });

  it('supports future public metadata and suspended visibility', () => {
    const service = toMunicipalService({
      ...dto,
      status: 'SUSPENDED',
      channels: ['ONLINE', 'PRESENCIAL'],
      audiences: ['MUNICIPE'],
      documents: ['BI'],
      synonyms: ['declaração'],
    });
    expect(service.availability).toBe('suspended');
    expect(service.channels).toEqual(['online', 'in_person']);
    expect(service.audiences).toEqual(['citizen']);
    expect(service.documents).toEqual(['BI']);
    expect(service.keywords).toEqual(['declaração']);
  });

  it('uses the existing list and slug endpoints', async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ success: true, data: [dto] })
      .mockResolvedValueOnce({ success: true, data: dto });

    await expect(getMunicipalServices()).resolves.toHaveLength(1);
    await expect(getMunicipalService('certidao-municipal')).resolves.toMatchObject({ slug: 'certidao-municipal' });
    expect(api.get).toHaveBeenNthCalledWith(1, '/public/services');
    expect(api.get).toHaveBeenNthCalledWith(2, '/public/services/certidao-municipal');
  });
});
