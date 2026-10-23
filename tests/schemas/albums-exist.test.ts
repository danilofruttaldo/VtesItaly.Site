/* Every `album` a post names must be in src/data/albums.json (the copy of
 * foto.vtesitaly.com/albums.json): a typo would silently drop the gallery. */
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { albumFor } from '../../src/utils/albums';

describe('post albums', () => {
  it('names only albums that exist on foto.vtesitaly.com', async () => {
    const posts = await getCollection('blog');
    const missing = posts.filter((p) => p.data.album && !albumFor(p.data.album)).map((p) => `${p.id}: ${p.data.album}`);
    expect(missing).toEqual([]);
  });
});
