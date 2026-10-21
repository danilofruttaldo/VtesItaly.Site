import { describe, it, expect } from 'vitest';
import { articleJsonLd, eventJsonLd, postDescription, postalAddress } from '../../src/utils/structured-data';

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
    expect(ld.location).toEqual({
      '@type': 'Place',
      name: 'Hotel Paoli',
      address: { '@type': 'PostalAddress', addressCountry: 'IT', addressLocality: 'Caldonazzo', addressRegion: 'TN' },
    });
    expect(ld.image).toBe('https://vtesitaly.com/nc/poster.webp');
  });

  it('ends a single-day event on its start day and falls back to the venue name as address', () => {
    const ld = eventJsonLd({ ...base, featuredImage: '/f.webp', venue: { name: 'Hotel Paoli' } }, site)!;
    expect(ld.endDate).toBe(ld.startDate);
    expect(ld.location).toEqual({
      '@type': 'Place',
      name: 'Hotel Paoli',
      address: { '@type': 'PostalAddress', addressCountry: 'IT', streetAddress: 'Hotel Paoli' },
    });
    expect(ld.image).toBe('https://vtesitaly.com/f.webp');
  });
});

describe('structured-data: event start and page', () => {
  it('starts on a Friday side event before the post date and carries url and language', () => {
    const ld = eventJsonLd(
      {
        ...base,
        date: new Date('2026-02-28'),
        venue: { name: 'Hotel', address: 'Via Roma 1, 38050 Caldonazzo (TN)' },
        events: [{ date: new Date('2026-02-27') }, { date: new Date('2026-02-28') }],
      },
      site,
      { url: 'https://vtesitaly.com/nazionale/nazionale-2026/', locale: 'it' },
    )!;
    expect(ld.startDate).toBe('2026-02-27');
    expect(ld.url).toBe('https://vtesitaly.com/nazionale/nazionale-2026/');
    expect(ld.inLanguage).toBe('it');
  });
});

describe('structured-data: online events', () => {
  it('gives no Event when the venue is just "Italia"', () => {
    expect(eventJsonLd({ ...base, venue: { name: 'Italia', address: 'Italia' } }, site)).toBeNull();
  });
});

describe('structured-data: postalAddress', () => {
  it('reads the town in the other address forms of the posts', () => {
    expect(postalAddress('Via Marco Emilio Lepido, 203/14 – 40132 Bologna (BO)')).toMatchObject({
      streetAddress: 'Via Marco Emilio Lepido, 203/14',
      postalCode: '40132',
      addressLocality: 'Bologna',
    });
    expect(postalAddress('Via Ranzani 13/2, Bologna')).toMatchObject({ addressLocality: 'Bologna' });
    expect(postalAddress('Viale X 5, 31100 Treviso')).toMatchObject({
      postalCode: '31100',
      addressLocality: 'Treviso',
    });
    expect(postalAddress('Via Roma 62/c, Paderno Dugnano (MI)')).toMatchObject({
      addressLocality: 'Paderno Dugnano',
      addressRegion: 'MI',
    });
    expect(postalAddress('Hotel Paoli')).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'IT',
      streetAddress: 'Hotel Paoli',
    });
  });

  it('splits the Italian address form into its parts', () => {
    expect(postalAddress('Viale della Fiera 20, 40127 Bologna (BO), Italy')).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'IT',
      streetAddress: 'Viale della Fiera 20',
      postalCode: '40127',
      addressLocality: 'Bologna',
      addressRegion: 'BO',
    });
    expect(postalAddress('38057 Pergine Valsugana (TN)')).toMatchObject({
      postalCode: '38057',
      addressLocality: 'Pergine Valsugana',
    });
  });
});

describe('structured-data: articleJsonLd', () => {
  it('dates the article by its git days and links its page', () => {
    const ld = articleJsonLd(base, site, {
      url: 'https://vtesitaly.com/x/',
      locale: 'en',
      published: '2026-01-10',
      modified: '2026-03-05',
    });
    expect(ld.datePublished).toBe('2026-01-10');
    expect(ld.dateModified).toBe('2026-03-05');
    expect(ld.inLanguage).toBe('en');
    expect(ld.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': 'https://vtesitaly.com/x/' });
  });

  it('dates an imported post by its own date, not by the import commit', () => {
    const ld = articleJsonLd({ ...base, date: new Date('2019-11-23') }, site, {
      url: 'https://vtesitaly.com/x/',
      locale: 'it',
      published: '2026-03-17',
      modified: '2026-10-21',
    });
    expect(ld.datePublished).toBe('2019-11-23');
    expect(ld.dateModified).toBe('2026-10-21');
  });

  it('never publishes in the future without git days', () => {
    const ld = articleJsonLd({ ...base, date: new Date('2027-04-23') }, site, undefined, '2026-10-21');
    expect(ld.datePublished).toBe('2026-10-21');
  });

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
