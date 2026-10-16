import { describe, it, expect } from 'vitest';
import { isoDate, isoDay } from '../../src/utils/date';

describe('date: isoDate / isoDay', () => {
  it('returns the calendar day of a frontmatter date (midnight UTC)', () => {
    expect(isoDate(new Date('2026-03-01'))).toBe('2026-03-01');
  });

  it('passes YYYY-MM-DD strings through', () => {
    expect(isoDay('2026-03-01')).toBe('2026-03-01');
    expect(isoDay(new Date('2026-12-31'))).toBe('2026-12-31');
  });
});
