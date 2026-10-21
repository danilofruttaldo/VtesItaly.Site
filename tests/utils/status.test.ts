import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  computeTourStatus,
  computeEventStatus,
  computeStageDisplayImages,
  stageDisplay,
  stageRevealDates,
  stageStatusesOn,
  resolvePlatformLabel,
  resolveLinkLabel,
  tourStatusOn,
  eventStatusOn,
  toStageDays,
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

  it("treats today's stage as live, regression on the e731108 timezone fix", () => {
    // FROZEN_NOW is 2026-04-21T12:00:00Z, same calendar day in Europe/Rome.
    // Before the setHours(0,0,0,0) fix, a stage at 2026-04-21T00:00:00Z would
    // be classified as "completed" because its raw timestamp was less than now.
    // The day of a stage is live, like a single event on its day.
    expect(computeTourStatus([{ date: new Date('2026-04-21T00:00:00Z') }])).toBe('live');
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

  it('reveals a stage cover once the previous stage day has come', () => {
    const stages = [
      { date: new Date('2026-01-15'), image: '/tour/2026/001.webp' },
      { date: new Date('2026-05-15'), image: '/tour/2026/002.webp' },
      { date: new Date('2026-06-15'), image: '/tour/2026/003.webp' },
      { date: new Date('2026-07-15'), image: '/tour/2026/004.webp', hideDate: true },
      { date: new Date('2026-08-15'), image: '/tour/2026/005.webp' },
    ];
    // After a hidden-date stage, a stage shows its cover only on its own day
    expect(stageRevealDates(stages)).toEqual(['', '2026-01-15', '2026-05-15', '2026-06-15', '2026-08-15']);
    expect(stageRevealDates([{ ...stages[3] }, { ...stages[3] }])).toEqual(['', null]);
    // Same rule as the build, re-run against a later day
    expect(computeStageDisplayImages(stages, '2026-05-15')).toEqual([
      '/tour/2026/001.webp',
      '/tour/2026/002.webp',
      '/tour/2026/003.webp',
      '/tour/2026/000.webp',
      '/tour/2026/000.webp',
    ]);
    // Build day 2026-04-21: stage 3 waits on the placeholder, with its swap day
    const display = stageDisplay(stages);
    expect(display[1]).toEqual({ image: '/tour/2026/002.webp' });
    expect(display[2]).toEqual({
      image: '/tour/2026/000.webp',
      revealImage: '/tour/2026/003.webp',
      revealFrom: '2026-05-15',
    });
    expect(display[4]).toEqual({
      image: '/tour/2026/000.webp',
      revealImage: '/tour/2026/005.webp',
      revealFrom: '2026-08-15',
    });
  });

  it('never hides a cancelled stage cover', () => {
    const stages = [
      { date: new Date('2026-06-01'), image: '/tour/2026/001.webp' },
      { date: new Date('2026-07-01'), image: '/tour/2026/002.webp', status: 'cancelled' },
    ];
    expect(stageRevealDates(stages)).toEqual(['', '']);
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

describe('status: resolveLinkLabel', () => {
  it('prefixes an editorial label before the platform name for Archon URLs', () => {
    expect(resolveLinkLabel({ label: 'Lega Milano 2026: Classifica', url: 'https://archon.example/league/1' })).toBe(
      'Lega Milano 2026: Classifica - Archon',
    );
  });
  it('prefixes the label for BCN Crisis URLs', () => {
    expect(resolveLinkLabel({ label: 'Standings', url: 'https://bcncrisis.com/t/1' })).toBe('Standings - BCN Crisis');
  });
  it('falls back to just the platform name when the label is empty', () => {
    expect(resolveLinkLabel({ label: '', url: 'https://archon.example/123' })).toBe('Archon');
  });
  it('returns the editorial label verbatim for non-platform URLs', () => {
    expect(resolveLinkLabel({ label: 'Infopack (PDF)', url: '/gp/2026/infopack.pdf' })).toBe('Infopack (PDF)');
  });
});

describe('status: tourStatusOn / eventStatusOn (shared with the browser script)', () => {
  it('computes the tour status from calendar days', () => {
    const day = (date: string, cancelled = false) => ({ date, cancelled });
    expect(tourStatusOn([], '2026-04-21')).toBeNull();
    expect(tourStatusOn([day('2026-05-01', true)], '2026-04-21')).toBeNull();
    expect(tourStatusOn([day('2026-01-01'), day('2026-02-01')], '2026-04-21')).toBe('past');
    expect(tourStatusOn([day('2026-04-21'), day('2026-06-01')], '2026-04-21')).toBe('live');
    expect(tourStatusOn([day('2026-04-22'), day('2026-06-01')], '2026-04-21')).toBe('upcoming');
    expect(tourStatusOn([day('2026-01-01'), day('2026-06-01')], '2026-04-21')).toBe('live');
  });

  it('computes the event status from calendar days', () => {
    expect(eventStatusOn('2026-04-21', '2026-04-21')).toBe('live');
    expect(eventStatusOn('2026-04-22', '2026-04-21')).toBe('upcoming');
    expect(eventStatusOn('2026-04-20', '2026-04-21')).toBe('past');
  });

  it('keeps a multi-day event live through its last day', () => {
    // NC 2026: 27 Feb - 1 Mar, main event on the 28th
    expect(eventStatusOn('2026-02-27', '2026-02-28', '2026-03-01')).toBe('live');
    expect(eventStatusOn('2026-02-27', '2026-03-01', '2026-03-01')).toBe('live');
    expect(eventStatusOn('2026-02-27', '2026-03-02', '2026-03-01')).toBe('past');
    expect(eventStatusOn('2026-02-27', '2026-02-26', '2026-03-01')).toBe('upcoming');
    expect(computeEventStatus(new Date('2026-04-20'), '2026-04-22')).toBe('live');
  });

  it('serializes stages for the page as days plus a cancelled flag', () => {
    expect(
      toStageDays([{ date: new Date('2026-03-01') }, { date: new Date('2026-04-01'), status: 'cancelled' }]),
    ).toEqual([
      { date: '2026-03-01', cancelled: false },
      { date: '2026-04-01', cancelled: true },
    ]);
  });
});

describe('status: stageStatusesOn', () => {
  const stage = (date: string, extra: Partial<{ cancelled: boolean; hidden: boolean }> = {}) => ({
    date,
    cancelled: false,
    hidden: false,
    ...extra,
  });

  it('marks the stage of the day and the next one as upcoming', () => {
    expect(
      stageStatusesOn(
        [stage('2026-03-01'), stage('2026-04-21'), stage('2026-05-01'), stage('2026-06-01')],
        '2026-04-21',
      ),
    ).toEqual(['completed', 'upcoming', 'upcoming', 'future']);
  });

  it('keeps cancelled stages and treats hidden dates as future', () => {
    expect(
      stageStatusesOn(
        [stage('2026-03-01', { cancelled: true }), stage('2026-09-01', { hidden: true }), stage('2026-10-01')],
        '2026-04-21',
      ),
    ).toEqual(['cancelled', 'upcoming', 'future']);
  });
});
