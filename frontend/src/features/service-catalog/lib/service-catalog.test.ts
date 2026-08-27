import { describe, expect, it } from 'vitest';

import type { MunicipalService } from '../types';
import { filterServices, formatFee, normalizeSearch } from './service-catalog';

const service: MunicipalService = {
  id: '1',
  slug: 'licenca-construcao',
  title: 'Licença de Construção',
  description: 'Pedido para obras particulares',
  category: 'Urbanismo',
  processingTime: '10 dias úteis',
  availability: 'available',
  availabilityLabel: 'Disponível',
  channels: ['online', 'in_person'],
  audiences: ['citizen'],
  requirements: [],
  documents: [],
  process: [],
  locations: [],
  legalReferences: [],
  faq: [],
  fees: [{ id: 'fee', title: 'Emissão', amount: 250, currency: 'MZN' }],
  keywords: ['obra'],
};

describe('service catalog filtering', () => {
  it('normalizes accents and matches associated terms', () => {
    expect(normalizeSearch('  Construção  ')).toBe('construcao');
    expect(filterServices([service], {
      search: 'obra',
      category: 'all',
      channel: 'all',
      audience: 'all',
      availability: 'all',
    })).toEqual([service]);
  });

  it('combines category, channel, audience, and availability', () => {
    expect(filterServices([service], {
      search: '',
      category: 'Urbanismo',
      channel: 'online',
      audience: 'citizen',
      availability: 'available',
    })).toEqual([service]);

    expect(filterServices([service], {
      search: '',
      category: 'Urbanismo',
      channel: 'informational',
      audience: 'citizen',
      availability: 'available',
    })).toEqual([]);
  });

  it('formats published fees without inventing a fallback amount', () => {
    expect(formatFee(service)).toContain('250');
    expect(formatFee({ ...service, fees: [] })).toBe('Valor não publicado');
    expect(formatFee({ ...service, fees: [{ ...service.fees[0], amount: 0 }] })).toBe('Gratuito');
  });
});
