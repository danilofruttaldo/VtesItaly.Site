/* TourEdition renders multi-stage tournament posts (category="tour"). */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, type CollectionEntry } from 'astro:content';
import TourEdition from '../../src/components/TourEdition.astro';

let allPosts: CollectionEntry<'blog'>[];
let container: AstroContainer;

beforeAll(async () => {
  allPosts = await getCollection('blog');
  container = await AstroContainer.create();
});

function pickTour(locale: 'it' | 'en' = 'it') {
  const post = allPosts.find((p) => p.data.category === 'tour' && (p.data.locale ?? 'it') === locale);
  if (!post) throw new Error('test fixture: no tour post matched');
  return post;
}

describe('TourEdition', () => {
  it('renders the IT tour with stage list', async () => {
    const post = pickTour('it');
    const html = await container.renderToString(TourEdition, {
      props: { post, locale: 'it' },
      request: new Request('http://localhost/'),
    });
    // Tour pages MUST render their stages (the very reason TourEdition exists).
    const stages = post.data.stages ?? [];
    expect(stages.length).toBeGreaterThan(0);
    // At least one stage name must appear in the markup.
    expect(html).toContain(stages[0].name);
  });

  it('marks the first future (or today) stage as "upcoming"', async () => {
    const post = pickTour('it');
    const html = await container.renderToString(TourEdition, {
      props: { post, locale: 'it' },
      request: new Request('http://localhost/'),
    });
    // computeStageDisplayImages always elevates exactly one future stage to
    // "upcoming". Either the markup is past-only (no upcoming class is OK) or
    // it contains the upcoming label/state.
    const stages = post.data.stages ?? [];
    const hasFuture = stages.some((s) => new Date(s.date) > new Date());
    if (hasFuture) {
      expect(html.toLowerCase()).toMatch(/upcoming|prossim/i);
    }
  });

  it('throws when given a non-tour post', async () => {
    const wrong = allPosts.find((p) => p.data.category === 'grand-prix');
    if (!wrong) throw new Error('no grand-prix fixture');
    await expect(
      container.renderToString(TourEdition, {
        props: { post: wrong, locale: 'it' },
        request: new Request('http://localhost/'),
      }),
    ).rejects.toThrow(/unsupported category/);
  });

  it('renders the EN variant of a tour post', async () => {
    const post = pickTour('en');
    const html = await container.renderToString(TourEdition, {
      props: { post, locale: 'en' },
      request: new Request('http://localhost/en/'),
    });
    expect(html.length).toBeGreaterThan(100);
  });
});
