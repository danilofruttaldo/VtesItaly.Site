import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getEnPostUrl, getCardImage, buildCityCards } from '../../src/utils/url';

const FROZEN_NOW = new Date('2026-05-18T12:00:00Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('url: getEnPostUrl', () => {
  it('builds /en/<category>/<slug>/ for generic categories', () => {
    expect(getEnPostUrl({ id: 'archon-tour-en', data: { category: 'archon' } })).toBe('/en/archon/archon-tour/');
  });

  it('strips a trailing -en from the slug', () => {
    expect(getEnPostUrl({ id: 'symposium-italicum-mmxxv-en', data: { category: 'comunita' } })).toBe(
      '/en/community/symposium-italicum-mmxxv/',
    );
  });

  it('translates "comunita" to "community"', () => {
    expect(getEnPostUrl({ id: 'milano-awakening-en', data: { category: 'comunita' } })).toBe(
      '/en/community/milano-awakening/',
    );
  });

  it('translates "nazionale" and rewrites the nazionale- slug prefix to nc-', () => {
    expect(getEnPostUrl({ id: 'nazionale-2026-en', data: { category: 'nazionale' } })).toBe(
      '/en/national-championship/nc-2026/',
    );
  });

  it('only strips a trailing -en, not -en in the middle', () => {
    // A slug like "pen-2025-en" should become "pen-2025", not "p-2025".
    expect(getEnPostUrl({ id: 'pen-2025-en', data: { category: 'tour' } })).toBe('/en/tour/pen-2025/');
  });
});

const makeTourPost = (overrides: {
  stages: {
    date: Date;
    cities?: string[];
    image?: string;
    status?: string;
    hideDate?: boolean;
    name?: string;
    description?: string;
  }[];
  poster?: string;
  featuredImage?: string;
}) => ({
  data: {
    category: 'tour',
    poster: overrides.poster,
    featuredImage: overrides.featuredImage,
    stages: overrides.stages,
  },
});

describe('url: getCardImage', () => {
  it('returns the poster for non-tour posts', () => {
    expect(
      getCardImage(
        {
          data: { category: 'comunita', poster: '/p.webp', featuredImage: '/f.webp' },
        },
        'milano',
      ),
    ).toBe('/p.webp');
  });

  it('falls back to featuredImage when poster is missing', () => {
    expect(
      getCardImage(
        {
          data: { category: 'comunita', featuredImage: '/f.webp' },
        },
        'milano',
      ),
    ).toBe('/f.webp');
  });

  it('returns undefined for a non-tour post with neither poster nor featuredImage', () => {
    expect(
      getCardImage(
        {
          data: { category: 'comunita' },
        },
        'milano',
      ),
    ).toBeUndefined();
  });

  it('returns the matching stage image for a tour post when the city is in a stage', () => {
    const post = makeTourPost({
      poster: '/poster.webp',
      stages: [
        { date: new Date('2026-03-01'), cities: ['roma'], image: '/stages/roma-001.webp' },
        { date: new Date('2026-06-01'), cities: ['milano'], image: '/stages/milano-002.webp' },
      ],
    });
    expect(getCardImage(post, 'milano')).toBe('/stages/milano-002.webp');
  });

  it('falls back to poster/featuredImage for a tour post when the city is not in any stage', () => {
    const post = makeTourPost({
      poster: '/poster.webp',
      stages: [{ date: new Date('2026-03-01'), cities: ['roma'], image: '/stages/roma-001.webp' }],
    });
    expect(getCardImage(post, 'milano')).toBe('/poster.webp');
  });

  it('falls back to the poster when the matching stage has no image', () => {
    const post = makeTourPost({
      poster: '/poster.webp',
      stages: [{ date: new Date('2026-03-01'), cities: ['milano'] }],
    });
    expect(getCardImage(post, 'milano')).toBe('/poster.webp');
  });

  it('returns the poster for a tour with no stages array', () => {
    expect(
      getCardImage(
        {
          data: { category: 'tour', poster: '/p.webp' },
        },
        'milano',
      ),
    ).toBe('/p.webp');
  });
});

// Minimal post factory: tests only care about .data — the rest of
// CollectionEntry<'blog'> (collection, body, render, etc.) is irrelevant
// to buildCityCards's pure transformation.
const post = (data: Record<string, unknown>) => ({ id: 'x', data }) as Parameters<typeof buildCityCards>[0][number];
const href = () => '/href';

describe('url: buildCityCards', () => {
  it('filters out posts that do not carry the city tag', () => {
    const out = buildCityCards(
      [
        post({ category: 'comunita', tags: ['milano'], title: 'Y', date: new Date('2026-04-01'), excerpt: '' }),
        post({ category: 'comunita', tags: ['roma'], title: 'N', date: new Date('2026-04-01'), excerpt: '' }),
      ],
      'milano',
      href,
    );
    expect(out.map((c) => c.title)).toEqual(['Y']);
  });

  it('keeps non-tour posts as a single card', () => {
    const out = buildCityCards(
      [
        post({
          category: 'comunita',
          tags: ['milano'],
          title: 'Awakening',
          date: new Date('2026-04-01'),
          poster: '/a.webp',
          excerpt: 'e',
        }),
      ],
      'milano',
      href,
    );
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ title: 'Awakening', image: '/a.webp', excerpt: 'e', href: '/href' });
  });

  it('expands tour stages into one card per matching stage with IT{YY} title prefix', () => {
    const out = buildCityCards(
      [
        post({
          category: 'tour',
          tags: ['milano', 'roma'],
          title: 'Italy Tour 2026',
          date: new Date('2026-01-15'),
          poster: '/poster.webp',
          excerpt: '-',
          stages: [
            {
              date: new Date('2026-03-01'),
              cities: ['roma'],
              image: '/stages/roma-001.webp',
              name: 'Roma',
              description: 'R',
            },
            {
              date: new Date('2026-06-01'),
              cities: ['milano'],
              image: '/stages/milano-002.webp',
              name: 'Milano',
              description: 'M',
            },
          ],
        }),
      ],
      'milano',
      href,
    );
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      title: 'IT26 — Milano',
      image: '/stages/milano-002.webp',
      excerpt: 'M',
    });
    expect(out[0].date.toISOString().startsWith('2026-06-01')).toBe(true);
  });

  it('skips tour stages with hideDate or no date', () => {
    const out = buildCityCards(
      [
        post({
          category: 'tour',
          tags: ['milano'],
          title: 'T',
          date: new Date('2026-01-01'),
          poster: '/p.webp',
          excerpt: '-',
          stages: [
            { date: new Date('2026-06-01'), cities: ['milano'], hideDate: true, name: 'Hidden' },
            { date: new Date('2026-09-01'), cities: ['milano'], image: '/s.webp', name: 'Visible' },
          ],
        }),
      ],
      'milano',
      href,
    );
    expect(out.map((c) => c.title)).toEqual(['IT26 — Visible']);
  });

  it('uses the stage description as excerpt, falling back to the post excerpt', () => {
    const out = buildCityCards(
      [
        post({
          category: 'tour',
          tags: ['milano'],
          title: 'T',
          date: new Date('2026-01-01'),
          poster: '/p.webp',
          excerpt: 'post-level',
          stages: [
            {
              date: new Date('2026-06-01'),
              cities: ['milano'],
              image: '/a.webp',
              name: 'A',
              description: 'stage-desc',
            },
            { date: new Date('2026-09-01'), cities: ['milano'], image: '/b.webp', name: 'B' },
          ],
        }),
      ],
      'milano',
      href,
    );
    // buildCityCards sorts descending: stage B (Sep) before stage A (Jun).
    expect(out.map((c) => c.excerpt)).toEqual(['post-level', 'stage-desc']);
  });

  it('returns results sorted descending by date', () => {
    const out = buildCityCards(
      [
        post({ category: 'comunita', tags: ['milano'], title: 'old', date: new Date('2024-01-01'), excerpt: '' }),
        post({ category: 'comunita', tags: ['milano'], title: 'new', date: new Date('2026-01-01'), excerpt: '' }),
        post({ category: 'comunita', tags: ['milano'], title: 'mid', date: new Date('2025-06-01'), excerpt: '' }),
      ],
      'milano',
      href,
    );
    expect(out.map((c) => c.title)).toEqual(['new', 'mid', 'old']);
  });

  it('falls back to poster when a tour stage matching the city has no image', () => {
    const out = buildCityCards(
      [
        post({
          category: 'tour',
          tags: ['milano'],
          title: 'T',
          date: new Date('2026-01-01'),
          poster: '/poster.webp',
          excerpt: '-',
          stages: [{ date: new Date('2026-06-01'), cities: ['milano'], name: 'M' }],
        }),
      ],
      'milano',
      href,
    );
    expect(out[0].image).toBe('/poster.webp');
  });
});
