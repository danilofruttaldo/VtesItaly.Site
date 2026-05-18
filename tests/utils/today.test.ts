import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { todayLocalIso, todayLocalMidnight } from '../../src/utils/today';

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

  it('uses local fields (not toISOString) — does not roll over before local midnight', () => {
    // 23:30 local on April 21: a UTC-based formatter could yield the next day
    // in negative-offset zones. We assert the local date is preserved.
    vi.setSystemTime(new Date(2026, 3, 21, 23, 30, 0));
    expect(todayLocalIso()).toBe('2026-04-21');
  });
});

describe('today: todayLocalMidnight', () => {
  it('returns a Date set to 00:00:00.000 in local time', () => {
    vi.setSystemTime(new Date(2026, 4, 18, 14, 30, 45, 678));
    const d = todayLocalMidnight();
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4);
    expect(d.getDate()).toBe(18);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  it('produces fresh Date instances on each call (no shared mutable state)', () => {
    vi.setSystemTime(new Date(2026, 4, 18, 14, 0, 0));
    const a = todayLocalMidnight();
    const b = todayLocalMidnight();
    expect(a).not.toBe(b);
    expect(a.getTime()).toBe(b.getTime());
  });

  it('mutating the returned Date does not affect subsequent calls', () => {
    vi.setSystemTime(new Date(2026, 4, 18, 14, 0, 0));
    const first = todayLocalMidnight();
    first.setDate(first.getDate() + 30);
    const second = todayLocalMidnight();
    expect(second.getDate()).toBe(18);
    expect(second.getMonth()).toBe(4);
  });
});
