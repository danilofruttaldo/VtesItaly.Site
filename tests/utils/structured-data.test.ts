import { describe, it, expect } from 'vitest';
import { articleJsonLd, eventJsonLd, postDescription } from '../../src/utils/structured-data';

const site = new URL('https://vtesitaly.com');
const base = {
  title: 'Nazionale 2026',
  date: new Date('2026-02-27'),
  excerpt: 'Il Campionato Nazionale.',
};

describe('structured-data: postDescription', () => {
  it('prefers seoDescription, then excerpt, then title', () => {
    expect(postDescription({ ...base, seoDescription: 'SEO' })).toBe('SEO');
    expect(postDescription(base)).toBe('Il Campionato Nazionale.');
    expect(postDescription({ title: 'Solo titolo' })).toBe('Solo titolo');
  });
});

describe('structured-data: eventJsonLd', () => {
  it('returns null without a venue (Google drops an Event with no location)', () => {
    expect(eventJsonLd(base, site)).toBeNull();
  });

  it('uses date-only start and end days and a Place', () => {
    const ld = eventJsonLd(
      {
        ...base,
        poster: '/nc/poster.webp',
        venue: { name: 'Hotel Paoli', address: 'Caldonazzo (TN)' },
        events: [
          { date: new Date('2026-02-27') },
          { date: new Date('2026-02-28'), endDate: new Date('2026-03-01') },
          { date: new Date('2026-05-01'), period: 'maggio' },
        ],
      },
      site,
    )!;
    expect(ld.startDate).toBe('2026-02-27');
    expect(ld.endDate).toBe('2026-03-01');
    expect(ld.location).toEqual({ '@type': 'Place', name: 'Hotel Paoli', address: 'Caldonazzo (TN)' });
    expect(ld.image).toBe('https://vtesitaly.com/nc/poster.webp');
  });

  it('omits endDate for a single day and falls back to the venue name as address', () => {
    const ld = eventJsonLd({ ...base, featuredImage: '/f.webp', venue: { name: 'Italia' } }, site)!;
    expect(ld.endDate).toBeUndefined();
    expect(ld.location).toEqual({ '@type': 'Place', name: 'Italia', address: 'Italia' });
    expect(ld.image).toBe('https://vtesitaly.com/f.webp');
  });
});

describe('structured-data: articleJsonLd', () => {
  it('builds an Article with date-only dates and optional keywords/image', () => {
    const ld = articleJsonLd({ ...base, tags: ['trento', 'nc'], poster: '/p.webp' }, site);
    expect(ld.datePublished).toBe('2026-02-27');
    expect(ld.keywords).toBe('trento, nc');
    expect(ld.image).toBe('https://vtesitaly.com/p.webp');
    const bare = articleJsonLd(base, site);
    expect(bare.keywords).toBeUndefined();
    expect(bare.image).toBeUndefined();
  });
});
