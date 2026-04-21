import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  computeTourStatus,
  computeEventStatus,
  computeStageDisplayImages,
  resolvePlatformLabel,
} from '../../src/utils/status';

// All tests pin "now" to a specific instant so date comparisons are
// deterministic regardless of when CI runs. The helpers internally call
// `setHours(0,0,0,0)` to compare day-by-day; pinning at noon avoids any DST
// cliff issues from running at midnight.
const FROZEN_NOW = new Date('2026-04-21T12:00:00Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('status: computeTourStatus', () => {
  it('returns null for an empty tour', () => {
    expect(computeTourStatus([])).toBeNull();
  });

  it('returns null when every stage is cancelled', () => {
    expect(
      computeTourStatus([
        { date: new Date('2026-03-01'), status: 'cancelled' },
        { date: new Date('2026-05-01'), status: 'cancelled' },
      ]),
    ).toBeNull();
  });

  it('reports past when all non-cancelled stages are in the past', () => {
    expect(
      computeTourStatus([
        { date: new Date('2026-01-15') },
        { date: new Date('2026-02-15') },
        { date: new Date('2026-06-01'), status: 'cancelled' },
      ]),
    ).toBe('past');
  });

  it('reports upcoming when all non-cancelled stages are in the future', () => {
    expect(computeTourStatus([{ date: new Date('2026-05-15') }, { date: new Date('2026-06-15') }])).toBe('upcoming');
  });

  it('reports live when stages straddle today', () => {
    expect(
      computeTourStatus([
        { date: new Date('2026-01-15') }, // past
        { date: new Date('2026-06-15') }, // future
      ]),
    ).toBe('live');
  });

  it("treats today's stage as future (live), regression on the e731108 timezone fix", () => {
    // FROZEN_NOW is 2026-04-21T12:00:00Z — same calendar day in Europe/Rome.
    // Before the setHours(0,0,0,0) fix, a stage at 2026-04-21T00:00:00Z would
    // be classified as "completed" because its raw timestamp was less than now.
    expect(computeTourStatus([{ date: new Date('2026-04-21T00:00:00Z') }])).toBe('upcoming');
  });
});

describe('status: computeEventStatus', () => {
  it('reports live when the event date is today', () => {
    expect(computeEventStatus(new Date('2026-04-21T08:00:00Z'))).toBe('live');
    expect(computeEventStatus(new Date('2026-04-21T22:00:00Z'))).toBe('live');
  });

  it('reports upcoming for future dates', () => {
    expect(computeEventStatus(new Date('2026-05-01'))).toBe('upcoming');
  });

  it('reports past for previous dates', () => {
    expect(computeEventStatus(new Date('2026-03-01'))).toBe('past');
  });
});

describe('status: computeStageDisplayImages', () => {
  it('returns the original image for completed stages', () => {
    const out = computeStageDisplayImages([{ date: new Date('2026-01-15'), image: '/tour/2026/001.webp' }]);
    expect(out).toEqual(['/tour/2026/001.webp']);
  });

  it('promotes the first future stage to "upcoming" and shows its real image', () => {
    const out = computeStageDisplayImages([
      { date: new Date('2026-01-15'), image: '/tour/2026/001.webp' }, // completed
      { date: new Date('2026-05-15'), image: '/tour/2026/002.webp' }, // first future → upcoming
      { date: new Date('2026-06-15'), image: '/tour/2026/003.webp' }, // future → placeholder
    ]);
    expect(out).toEqual([
      '/tour/2026/001.webp',
      '/tour/2026/002.webp',
      '/tour/2026/000.webp', // placeholder = first stage with last 3 digits zeroed
    ]);
  });

  it('returns undefined slots for stages without an image', () => {
    const out = computeStageDisplayImages([
      { date: new Date('2026-01-15') },
      { date: new Date('2026-06-15'), image: '/tour/2026/002.webp' },
    ]);
    expect(out[0]).toBeUndefined();
    expect(out[1]).toBe('/tour/2026/002.webp');
  });

  it('handles a today-stage as "upcoming" not "future"', () => {
    const out = computeStageDisplayImages([{ date: new Date('2026-04-21T08:00:00Z'), image: '/tour/2026/001.webp' }]);
    expect(out).toEqual(['/tour/2026/001.webp']);
  });
});

describe('status: resolvePlatformLabel', () => {
  it('recognizes BCN Crisis URLs', () => {
    expect(resolvePlatformLabel('https://bcncrisis.com/foo')).toBe('BCN Crisis');
  });
  it('recognizes Archon URLs', () => {
    expect(resolvePlatformLabel('https://archon.example/123')).toBe('Archon');
  });
  it('recognizes vtesitaly URLs', () => {
    expect(resolvePlatformLabel('https://vtesitaly.com/grand-prix/2026/')).toBe('Site');
  });
  it('falls back to the raw URL for unknown platforms', () => {
    expect(resolvePlatformLabel('https://random.example/x')).toBe('https://random.example/x');
  });
});
