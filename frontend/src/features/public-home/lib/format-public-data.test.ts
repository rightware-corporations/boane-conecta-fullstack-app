import { describe, expect, it } from 'vitest';

import { formatPublicDate } from '@/features/public-home/lib/format-public-data';

describe('formatPublicDate', () => {
  it('returns null for missing or invalid dates', () => {
    expect(formatPublicDate(null)).toBeNull();
    expect(formatPublicDate('invalid')).toBeNull();
  });

  it('formats public dates in the Maputo business timezone', () => {
    expect(formatPublicDate('2026-08-26T22:30:00.000Z')).toContain('27');
    expect(formatPublicDate('2026-08-26T22:30:00.000Z')).toContain('2026');
  });
});
