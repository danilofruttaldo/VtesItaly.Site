/* Every `album` a post names must be in src/data/albums.json (the copy of
 * foto.vtesitaly.com/albums.json): a typo would silently drop the gallery. */
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { albumFor } from '../../src/utils/albums';

describe('post albums', () => {
  it('names only albums that exist on foto.vtesitaly.com', async () => {
    const posts = await getCollection('blog');
    // The post's own album and those of its events (side events) and stages.
    const named = posts.flatMap((p) => {
      const d = p.data as { album?: string; events?: { album?: string }[]; stages?: { album?: string }[] };
      return [d.album, ...(d.events ?? []).map((e) => e.album), ...(d.stages ?? []).map((s) => s.album)]
        .filter((a): a is string => !!a)
        .map((a) => ({ id: p.id, album: a }));
    });
    expect(named.some((n) => n.album === 'tour-2026-ira')).toBe(true);
    const missing = named.filter((n) => !albumFor(n.album)).map((n) => `${n.id}: ${n.album}`);
    expect(missing).toEqual([]);
  });
});
