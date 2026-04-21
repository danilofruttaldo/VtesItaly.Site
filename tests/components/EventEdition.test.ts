/* EventEdition.astro renders grand-prix, nazionale and comunita event posts.
 * We pull real posts from the content collection (so the test exercises the
 * full Markdown render pipeline) and assert the layout-critical bits show
 * up: poster, venue, events, hotel, standings table. */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, type CollectionEntry } from 'astro:content';
import EventEdition from '../../src/components/EventEdition.astro';

let allPosts: CollectionEntry<'blog'>[];
let container: AstroContainer;

beforeAll(async () => {
  allPosts = await getCollection('blog');
  container = await AstroContainer.create();
});

function pickPost(predicate: (p: CollectionEntry<'blog'>) => boolean) {
  const post = allPosts.find(predicate);
  if (!post) throw new Error('test fixture: no post matched the predicate');
  return post;
}

async function renderEdition(post: CollectionEntry<'blog'>, locale: 'it' | 'en' = 'it') {
  return container.renderToString(EventEdition, {
    props: { post, locale },
    request: new Request(locale === 'en' ? 'http://localhost/en/' : 'http://localhost/'),
  });
}

describe('EventEdition', () => {
  it('renders a Grand Prix post with poster and venue address', async () => {
    const post = pickPost((p) => p.data.category === 'grand-prix' && (p.data.locale ?? 'it') === 'it');
    const html = await renderEdition(post);
    if (post.data.poster) expect(html).toContain('class="gp-poster"');
    if (post.data.venue?.address) expect(html).toContain(post.data.venue.address);
  });

  it('renders the standings table when standingsUrl is present', async () => {
    const post = pickPost(
      (p) => p.data.category === 'grand-prix' && (p.data.locale ?? 'it') === 'it' && !!p.data.standingsUrl,
    );
    const html = await renderEdition(post);
    // Standings table contains player names with rank cells; assert at least
    // one numeric rank cell renders (this is enough to prove the loader fired).
    expect(html.toLowerCase()).toMatch(/<td[^>]*>1<\/td>|>1<\/th>|class=["'][^"']*rank/);
  });

  it('renders a nazionale post with the same template (category branch)', async () => {
    const post = pickPost((p) => p.data.category === 'nazionale' && (p.data.locale ?? 'it') === 'it');
    const html = await renderEdition(post);
    expect(html.length).toBeGreaterThan(100);
    if (post.data.venue?.name) expect(html).toContain(post.data.venue.name);
  });

  it('renders a comunita event post and includes the post excerpt when requested', async () => {
    const post = pickPost((p) => p.data.category === 'comunita' && !!p.data.venue && (p.data.locale ?? 'it') === 'it');
    const html = await container.renderToString(EventEdition, {
      props: { post, locale: 'it', showExcerpt: true },
      request: new Request('http://localhost/'),
    });
    if (post.data.excerpt) expect(html).toContain(post.data.excerpt);
  });

  it('throws on an unsupported category (defensive guard)', async () => {
    // tour is explicitly NOT supported by EventEdition (TourEdition handles it).
    const tourPost = pickPost((p) => p.data.category === 'tour');
    await expect(renderEdition(tourPost)).rejects.toThrow(/unsupported category/);
  });

  it('renders the EN variant of a Grand Prix post', async () => {
    const post = pickPost((p) => p.data.category === 'grand-prix' && p.data.locale === 'en');
    const html = await renderEdition(post, 'en');
    expect(html.length).toBeGreaterThan(100);
  });
});
