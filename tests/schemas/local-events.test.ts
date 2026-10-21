/* A calendar-only event in src/data/local-events.json must not repeat an
 * event a post already carries (a tour stage, a GP/NC side event): the
 * calendar would show the same tournament twice on that day. Same day and
 * same city count as the same event. */
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import localEvents from '../../src/data/local-events.json';
import { isoDate } from '../../src/utils/date';

describe('local-events.json', () => {
  it('holds no event already published by a post', async () => {
    const posts = await getCollection('blog');
    const fromPosts = new Set<string>();
    for (const post of posts) {
      for (const stage of post.data.stages ?? []) {
        for (const city of stage.cities) fromPosts.add(`${isoDate(new Date(stage.date))} ${city}`);
      }
      for (const ev of post.data.events ?? []) {
        if (ev.period) continue;
        for (const tag of post.data.tags) fromPosts.add(`${isoDate(new Date(ev.date))} ${tag}`);
      }
    }
    const dupes = localEvents
      .filter((le) => fromPosts.has(`${le.date} ${le.city}`))
      .map((le) => `${le.date} ${le.city}: ${le.name}`);
    expect(dupes).toEqual([]);
  });

  it('lists the newest event first', () => {
    const dates = localEvents.map((le) => le.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});
