import { describe, it, expect } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { composeFormat, pickTimelineWindow, getCommunityTimeline, type TimelineEntry } from '../../src/utils/calendar';

type BlogEntry = CollectionEntry<'blog'>;

function mkPost(id: string, data: Partial<BlogEntry['data']> & { date: Date }): BlogEntry {
  return {
    id,
    body: '',
    collection: 'blog',
    data: {
      title: data.title ?? `Post ${id}`,
      excerpt: data.excerpt ?? '',
      tags: data.tags ?? [],
      locale: data.locale ?? 'it',
      category: data.category ?? 'comunita',
      ...data,
    },
  } as unknown as BlogEntry;
}

const ENTRY = (date: string, title = date): TimelineEntry => ({
  date,
  title,
  url: `/${date}/`,
  category: 'comunita',
  tags: [],
});

describe('composeFormat', () => {
  it('returns TBD when format is missing', () => {
    expect(composeFormat(undefined, false, 3, 'it')).toBe('TBD');
    expect(composeFormat('', false, 3, 'it')).toBe('TBD');
  });

  it('returns the literal "TBD" without decorations when format === "TBD"', () => {
    expect(composeFormat('TBD', true, 4, 'it')).toBe('TBD');
  });

  it('marks unknown formats as Speciale (IT) / Special (EN)', () => {
    expect(composeFormat('SuperWeird', false, 3, 'it')).toBe('Speciale');
    expect(composeFormat('SuperWeird', false, 3, 'en')).toBe('Special');
  });

  it('appends the proxies clause in IT', () => {
    expect(composeFormat('Standard', true, undefined, 'it')).toBe('Standard, Proxy Ammesse');
    expect(composeFormat('Standard', false, undefined, 'it')).toBe('Standard, No Proxy');
  });

  it('appends the proxies clause in EN', () => {
    expect(composeFormat('V5', true, undefined, 'en')).toBe('V5, Proxies Allowed');
    expect(composeFormat('V5', false, undefined, 'en')).toBe('V5, No Proxies');
  });

  it('omits the proxies clause when undefined', () => {
    expect(composeFormat('Standard', undefined, undefined, 'it')).toBe('Standard');
  });

  it('appends rounds + final in IT (singular)', () => {
    expect(composeFormat('Standard', undefined, 1, 'it')).toBe('Standard — 1 Round + Finale');
  });

  it('appends rounds + final in IT (3 rounds, IT keeps "Round" invariant)', () => {
    expect(composeFormat('Standard', undefined, 3, 'it')).toBe('Standard — 3 Round + Finale');
  });

  it('pluralises rounds in EN', () => {
    expect(composeFormat('V5', undefined, 1, 'en')).toBe('V5 — 1 Round + Final');
    expect(composeFormat('V5', undefined, 3, 'en')).toBe('V5 — 3 Rounds + Final');
  });

  it('combines proxies + rounds correctly', () => {
    expect(composeFormat('Standard', true, 4, 'it')).toBe('Standard, Proxy Ammesse — 4 Round + Finale');
    expect(composeFormat('V5', false, 4, 'en')).toBe('V5, No Proxies — 4 Rounds + Final');
  });
});

describe('pickTimelineWindow', () => {
  const TODAY = '2026-05-12';

  it('returns empty window when there are no entries', () => {
    expect(pickTimelineWindow([], TODAY)).toEqual({ entries: [], highlightIndex: -1 });
  });

  it('balanced case: 2 above + next + 2 below, newest at top', () => {
    const entries = [
      ENTRY('2026-01-10'),
      ENTRY('2026-02-10'),
      ENTRY('2026-04-01'),
      ENTRY('2026-05-15'), // next (>= today)
      ENTRY('2026-06-01'),
      ENTRY('2026-07-01'),
      ENTRY('2026-08-01'),
    ];
    const w = pickTimelineWindow(entries, TODAY);
    expect(w.entries.map((e) => e.date)).toEqual([
      '2026-07-01',
      '2026-06-01',
      '2026-05-15', // next, highlighted
      '2026-04-01',
      '2026-02-10',
    ]);
    expect(w.highlightIndex).toBe(2);
  });

  it('pivot picks the first entry strictly on/after today', () => {
    const w = pickTimelineWindow([ENTRY(TODAY), ENTRY('2026-05-13'), ENTRY('2026-05-14')], TODAY);
    expect(w.entries[w.highlightIndex].date).toBe(TODAY);
  });

  it('no upcoming events: shows last 5 past entries newest-first, no highlight', () => {
    const entries = [
      ENTRY('2025-01-01'),
      ENTRY('2025-02-01'),
      ENTRY('2025-03-01'),
      ENTRY('2025-04-01'),
      ENTRY('2025-05-01'),
      ENTRY('2025-06-01'),
    ];
    const w = pickTimelineWindow(entries, TODAY);
    expect(w.highlightIndex).toBe(-1);
    expect(w.entries.map((e) => e.date)).toEqual([
      '2025-06-01',
      '2025-05-01',
      '2025-04-01',
      '2025-03-01',
      '2025-02-01',
    ]);
  });

  it('few past entries: borrows extra from the future side to keep 5 total', () => {
    const entries = [
      ENTRY('2026-04-01'),
      ENTRY('2026-05-15'), // next
      ENTRY('2026-06-01'),
      ENTRY('2026-07-01'),
      ENTRY('2026-08-01'),
      ENTRY('2026-09-01'),
    ];
    const w = pickTimelineWindow(entries, TODAY);
    // Only 1 past available → take 3 future-after (instead of 2) to keep total = 5.
    expect(w.entries.map((e) => e.date)).toEqual([
      '2026-08-01',
      '2026-07-01',
      '2026-06-01',
      '2026-05-15', // highlighted
      '2026-04-01',
    ]);
    expect(w.highlightIndex).toBe(3);
  });

  it('few future entries: borrows extra from the past side', () => {
    const entries = [
      ENTRY('2026-01-01'),
      ENTRY('2026-02-01'),
      ENTRY('2026-03-01'),
      ENTRY('2026-04-01'),
      ENTRY('2026-05-15'), // next, no future-after
    ];
    const w = pickTimelineWindow(entries, TODAY);
    expect(w.entries.map((e) => e.date)).toEqual([
      '2026-05-15', // highlighted at top because no future-after exists
      '2026-04-01',
      '2026-03-01',
      '2026-02-01',
      '2026-01-01',
    ]);
    expect(w.highlightIndex).toBe(0);
  });

  it('handles fewer than 5 total entries without crashing', () => {
    const entries = [ENTRY('2026-04-01'), ENTRY('2026-05-15'), ENTRY('2026-06-01')];
    const w = pickTimelineWindow(entries, TODAY);
    expect(w.entries).toHaveLength(3);
    expect(w.entries[w.highlightIndex].date).toBe('2026-05-15');
  });
});

describe('getCommunityTimeline', () => {
  it('emits one entry per dated event, copying post excerpt', () => {
    const posts = [
      mkPost('multi', {
        date: new Date('2026-05-01'),
        excerpt: 'shared excerpt',
        category: 'comunita',
        events: [
          { name: 'Night 1', date: new Date('2026-05-17'), time: '14:15' },
          { name: 'Night 2', date: new Date('2026-05-24'), time: '14:15' },
        ],
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it');
    const blogEntries = out.filter((e) => e.url.includes('multi'));
    expect(blogEntries).toHaveLength(2);
    expect(blogEntries[0].title).toBe('Night 1');
    expect(blogEntries[0].excerpt).toBe('shared excerpt');
    expect(blogEntries[1].title).toBe('Night 2');
  });

  it('uses post title (not event name) when post has a single event', () => {
    const posts = [
      mkPost('solo-event', {
        date: new Date('2026-05-15'),
        title: 'Rise of the Nephtali',
        category: 'comunita',
        events: [{ name: 'Rise of the Nephtali', date: new Date('2026-09-19'), time: '10:00' }],
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it').filter((e) => e.url.includes('solo-event'));
    expect(out).toHaveLength(1);
    expect(out[0].title).toBe('Rise of the Nephtali');
    expect(out[0].date).toBe('2026-09-19');
  });

  it('skips period-only league events and 1st-of-month placeholders', () => {
    const posts = [
      mkPost('league', {
        date: new Date('2026-01-01'),
        category: 'comunita',
        events: [
          { name: 'Period entry', date: new Date('2026-05-01'), time: '', period: 'May-Jun' },
          { name: 'Placeholder', date: new Date('2026-07-01'), time: '' },
          { name: 'Real night', date: new Date('2026-07-15'), time: '20:00' },
        ],
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it').filter((e) => e.url.includes('league'));
    expect(out.map((e) => e.title)).toEqual(['Real night']);
  });

  it('falls back to post.date for posts with no events/stages', () => {
    const posts = [
      mkPost('article', {
        date: new Date('2026-03-16'),
        title: 'Nasce il Principato di Elba',
        excerpt: 'A new domain appears',
        category: 'comunita',
        articleOnly: true,
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it').filter((e) => e.url.includes('article'));
    expect(out).toHaveLength(1);
    expect(out[0].date).toBe('2026-03-16');
    expect(out[0].title).toBe('Nasce il Principato di Elba');
    expect(out[0].excerpt).toBe('A new domain appears');
  });

  it('emits one entry per tour stage with IT<yy> — <name> title', () => {
    const posts = [
      mkPost('tour', {
        date: new Date('2026-01-01'),
        category: 'tour',
        excerpt: 'tour excerpt',
        stages: [
          { name: 'STAGE A', number: 1, cities: ['x'], date: new Date('2026-04-10'), time: '10:00', status: 'future' },
          {
            name: 'STAGE B',
            number: 2,
            cities: ['y'],
            date: new Date('2026-06-20'),
            time: '10:00',
            description: 'Specific desc',
            status: 'future',
          },
        ],
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it').filter((e) => e.url.includes('tour'));
    expect(out.map((e) => e.title)).toEqual(['IT26 — STAGE A', 'IT26 — STAGE B']);
    expect(out[0].excerpt).toBe('tour excerpt');
    expect(out[1].excerpt).toBe('Specific desc');
  });

  it('always appends local events with city-based excerpt', () => {
    // No blog posts → only local events flow through.
    const out = getCommunityTimeline([], 'it');
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((e) => e.category === 'local')).toBe(true);
    const sample = out[0];
    expect(sample.excerpt).toBeTruthy();
  });

  it('output is sorted ascending by date', () => {
    const posts = [
      mkPost('a', {
        date: new Date('2026-12-01'),
        category: 'comunita',
        articleOnly: true,
      } as Partial<BlogEntry['data']> & { date: Date }),
      mkPost('b', {
        date: new Date('2026-01-01'),
        category: 'comunita',
        articleOnly: true,
      } as Partial<BlogEntry['data']> & { date: Date }),
    ];
    const out = getCommunityTimeline(posts, 'it');
    for (let i = 1; i < out.length; i++) {
      expect(out[i].date >= out[i - 1].date).toBe(true);
    }
  });
});
