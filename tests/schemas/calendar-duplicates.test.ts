/* A community tournament post must not repeat an event that a Tour stage or a
 * GP/NC weekend already carries on the same day in the same city, unless both
 * point at the same Archon tournament: extractCalendarEvents merges entries
 * only by day + Archon link, so the calendar (and the Google Calendar sync)
 * would show the tournament twice. */
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { isoDate } from '../../src/utils/date';

describe('calendar duplicates', () => {
  it('no community event repeats a Tour, GP or NC event of the same day and city', async () => {
    const posts = (await getCollection('blog')).filter((p) => (p.data.locale ?? 'it') === 'it');
    const official = new Map<string, Set<string | undefined>>();
    const add = (key: string, archonUrl: string | undefined) => {
      if (!official.has(key)) official.set(key, new Set());
      official.get(key)!.add(archonUrl);
    };
    for (const post of posts) {
      for (const stage of post.data.stages ?? []) {
        for (const city of stage.cities) add(`${isoDate(new Date(stage.date))} ${city}`, stage.archonUrl);
      }
      if (post.data.category !== 'grand-prix' && post.data.category !== 'nazionale') continue;
      for (const ev of post.data.events ?? []) {
        if (ev.period) continue;
        for (const tag of post.data.tags) add(`${isoDate(new Date(ev.date))} ${tag}`, ev.archonUrl);
      }
    }
    const dupes: string[] = [];
    for (const post of posts) {
      if (post.data.category !== 'comunita') continue;
      for (const ev of post.data.events ?? []) {
        if (ev.period) continue;
        for (const tag of post.data.tags) {
          const seen = official.get(`${isoDate(new Date(ev.date))} ${tag}`);
          if (seen && !(ev.archonUrl && seen.has(ev.archonUrl))) dupes.push(`${post.id} ${isoDate(new Date(ev.date))}`);
        }
      }
    }
    expect(dupes).toEqual([]);
  });
});
