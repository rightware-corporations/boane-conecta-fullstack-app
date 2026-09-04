import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDateTime, formatOperationalAge, formatTime } from './formatters';

describe('pt-MZ operational formatters', () => {
  it('formats valid temporal values and keeps safe fallbacks', () => {
    expect(formatTime('2026-08-31T08:30:00Z')).toMatch(/10:30/);
    expect(formatDateTime(null)).toBe('Horário por confirmar');
  });

  it('formats operational age without creating negative ages', () => {
    const now = new Date('2026-08-31T10:00:00Z');
    expect(formatOperationalAge('2026-08-31T09:35:00Z', now)).toBe('Há 25 min');
    expect(formatOperationalAge('2026-08-31T12:00:00Z', now)).toBe('Agora');
  });

  it('formats MZN and rejects invalid values', () => {
    expect(formatCurrency(1250)).toContain('1');
    expect(formatCurrency(Number.NaN)).toBe('Valor por confirmar');
  });
});
