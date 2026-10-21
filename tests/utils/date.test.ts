import { describe, it, expect } from 'vitest';
import { firstEventDay, isoDate, isoDay, lastEventDay } from '../../src/utils/date';

describe('date: isoDate / isoDay', () => {
  it('returns the calendar day of a frontmatter date (midnight UTC)', () => {
    expect(isoDate(new Date('2026-03-01'))).toBe('2026-03-01');
  });

  it('passes YYYY-MM-DD strings through', () => {
    expect(isoDay('2026-03-01')).toBe('2026-03-01');
    expect(isoDay(new Date('2026-12-31'))).toBe('2026-12-31');
  });
});

describe('date: lastEventDay', () => {
  it('returns the latest day among dates and end dates, skipping league periods', () => {
    const events = [
      { date: new Date('2026-02-27') },
      { date: new Date('2026-02-28'), endDate: new Date('2026-03-01') },
      { date: new Date('2026-12-01'), period: 'TBD' },
    ];
    expect(lastEventDay(events, '2026-02-27')).toBe('2026-03-01');
  });

  it('falls back to the start day', () => {
    expect(lastEventDay(undefined, '2026-04-21')).toBe('2026-04-21');
    expect(lastEventDay([], '')).toBe('');
  });
});

describe('date: firstEventDay', () => {
  it('returns the earliest event day, never later than the post date', () => {
    const events = [
      { date: new Date('2026-02-28') },
      { date: new Date('2026-02-27') },
      { date: new Date('2026-01-01'), period: 'TBD' },
    ];
    expect(firstEventDay(events, '2026-02-28')).toBe('2026-02-27');
    expect(firstEventDay([{ date: new Date('2026-03-01') }], '2026-02-28')).toBe('2026-02-28');
    expect(firstEventDay(undefined, '2026-02-28')).toBe('2026-02-28');
  });
});
