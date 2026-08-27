import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getHomeAlerts,
  getHomeOpportunities,
  getHomeProjects,
  getHomeServices,
  getHomeUpdates,
} from '@/features/public-home/api/public-home.api';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: { get: vi.fn() },
}));

describe('public home API adapters', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the implemented public service contract to the home model', async () => {
    vi.mocked(api.get).mockResolvedValue({
      success: true,
      data: [{
        id: 'service-1',
        departmentName: 'Atendimento',
        title: 'Serviço publicado',
        slug: 'servico-publicado',
        description: 'Descrição validada pelo backend.',
        processingTime: 'Prazo publicado',
      }],
    });

    await expect(getHomeServices()).resolves.toEqual([{
      id: 'service-1',
      name: 'Serviço publicado',
      category: 'Atendimento',
      description: 'Descrição validada pelo backend.',
      duration: 'Prazo publicado',
    }]);
    expect(api.get).toHaveBeenCalledWith('/public/services');
  });

  it('keeps unsupported public domains empty instead of fabricating content', async () => {
    await expect(Promise.all([
      getHomeAlerts(),
      getHomeOpportunities(),
      getHomeUpdates(),
      getHomeProjects(),
    ])).resolves.toEqual([[], [], [], []]);
    expect(api.get).not.toHaveBeenCalled();
  });
});
