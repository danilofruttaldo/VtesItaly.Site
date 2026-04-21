/* LeagueEdition renders comunita posts that have leagueStats. */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, type CollectionEntry } from 'astro:content';
import LeagueEdition from '../../src/components/LeagueEdition.astro';

let allPosts: CollectionEntry<'blog'>[];
let container: AstroContainer;

beforeAll(async () => {
  allPosts = await getCollection('blog');
  container = await AstroContainer.create();
});

function pickLeague() {
  const post = allPosts.find(
    (p) => p.data.category === 'comunita' && !!p.data.leagueStats && (p.data.locale ?? 'it') === 'it',
  );
  if (!post) throw new Error('test fixture: no league post matched');
  return post;
}

describe('LeagueEdition', () => {
  it('renders the league title from the post', async () => {
    const post = pickLeague();
    const html = await container.renderToString(LeagueEdition, {
      props: { post, locale: 'it' },
      request: new Request('http://localhost/'),
    });
    expect(html).toContain(post.data.title);
  });

  it('exposes the leagueStats triple (players / games / tables)', async () => {
    const post = pickLeague();
    const html = await container.renderToString(LeagueEdition, {
      props: { post, locale: 'it' },
      request: new Request('http://localhost/'),
    });
    // pickLeague filters to comunita posts with leagueStats, but the
    // discriminated union doesn't narrow through the predicate — assert here.
    if (post.data.category !== 'comunita' || !post.data.leagueStats) {
      throw new Error('test fixture: expected a comunita post with leagueStats');
    }
    const { players, games, tables } = post.data.leagueStats;
    // The numbers must surface somewhere in the rendered markup.
    expect(html).toContain(String(players));
    expect(html).toContain(String(games));
    expect(html).toContain(String(tables));
  });

  it('throws when handed a non-comunita post', async () => {
    const wrong = allPosts.find((p) => p.data.category === 'tour');
    if (!wrong) throw new Error('no tour fixture');
    await expect(
      container.renderToString(LeagueEdition, {
        props: { post: wrong, locale: 'it' },
        request: new Request('http://localhost/'),
      }),
    ).rejects.toThrow(/unsupported category/);
  });
});
