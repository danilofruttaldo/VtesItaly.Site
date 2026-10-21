import { describe, it, expect } from 'vitest';
import { firstPastIndex, nextEventIndex, priceColumns, timelineWindow } from '../../src/utils/timeline';

const span = (s: { date: string; endDate?: string }) => s;
const day = (date: string, endDate?: string) => ({ date, endDate });

describe('timeline: timelineWindow', () => {
  it('centres five items on the next event, future above and past below', () => {
    const items = ['01', '02', '03', '04', '05', '06', '07'].map((d) => day(`2026-05-${d}`));
    const w = timelineWindow(items, '2026-05-04', span);
    expect(w.entries.map((e) => e.date.slice(-2))).toEqual(['06', '05', '04', '03', '02']);
    expect(w.highlightIndex).toBe(2);
  });

  it('keeps a multi-day event as the pivot until its last day', () => {
    const items = [day('2026-02-20'), day('2026-02-27', '2026-03-01'), day('2026-04-01')];
    expect(timelineWindow(items, '2026-02-28', span).entries[1].date).toBe('2026-02-27');
  });

  it('shows the latest five without highlight when everything is past', () => {
    const items = ['01', '02', '03', '04', '05', '06'].map((d) => day(`2026-01-${d}`));
    const w = timelineWindow(items, '2026-12-01', span);
    expect(w.highlightIndex).toBe(-1);
    expect(w.entries[0].date).toBe('2026-01-06');
    expect(w.entries).toHaveLength(5);
  });
});

describe('timeline: past split and next event', () => {
  // newest first, like the community list
  const items = [day('2026-06-01'), day('2026-05-01', '2026-05-03'), day('2026-04-01')];

  it('counts an event as past only after its last day', () => {
    expect(firstPastIndex(items, '2026-05-02', span)).toBe(2);
    expect(firstPastIndex(items, '2026-05-04', span)).toBe(1);
  });

  it('picks the last future item as the next event', () => {
    expect(nextEventIndex(items, '2026-05-02', span)).toBe(1);
    expect(nextEventIndex(items, '2026-01-01', span)).toBe(2);
    expect(nextEventIndex(items, '2026-12-01', span)).toBe(-1);
  });
});

describe('timeline: priceColumns', () => {
  it('keeps the early price through its deadline day, then regular, then none', () => {
    expect(priceColumns('2026-04-10', '2026-05-01', '2026-04-10')).toEqual({ earlyActive: true, regularActive: false });
    expect(priceColumns('2026-04-11', '2026-05-01', '2026-04-10')).toEqual({ earlyActive: false, regularActive: true });
    expect(priceColumns('2026-05-01', '2026-05-01', '2026-04-10')).toEqual({ earlyActive: false, regularActive: true });
    expect(priceColumns('2026-05-02', '2026-05-01')).toEqual({ earlyActive: false, regularActive: false });
  });
});
