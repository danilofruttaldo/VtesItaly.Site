import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { todayLocalIso } from '../../src/utils/today';

// Helpers are intentionally local-time aware (homepage timeline pivots at the
// reader's midnight, not UTC). We pin Date via fake timers so assertions are
// stable regardless of when CI runs.

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('today: todayLocalIso', () => {
  it('returns the YYYY-MM-DD form of the current local date', () => {
    vi.setSystemTime(new Date(2026, 4, 18, 14, 30, 0));
    expect(todayLocalIso()).toBe('2026-05-18');
  });

  it('zero-pads single-digit months and days', () => {
    vi.setSystemTime(new Date(2026, 0, 3, 9, 0, 0));
    expect(todayLocalIso()).toBe('2026-01-03');
  });

  it('uses local fields (not toISOString): does not roll over before local midnight', () => {
    // 23:30 local on April 21: a UTC-based formatter could yield the next day
    // in negative-offset zones. We assert the local date is preserved.
    vi.setSystemTime(new Date(2026, 3, 21, 23, 30, 0));
    expect(todayLocalIso()).toBe('2026-04-21');
  });
});
