import { isoDate, lastEventDay } from './date';

/** The post fields the structured data reads: a subset of the blog schema. */
export interface JsonLdPost {
  title: string;
  date: Date;
  excerpt?: string;
  seoDescription?: string;
  tags?: string[];
  poster?: string;
  featuredImage?: string;
  venue?: { name: string; address?: string };
  events?: { date: Date; endDate?: Date; period?: string }[];
}

/** Meta description of a post: the SEO override, else the card excerpt, else the title. */
export function postDescription(data: Pick<JsonLdPost, 'title' | 'excerpt' | 'seoDescription'>): string {
  return data.seoDescription || data.excerpt || data.title;
}

/**
 * schema.org `Event` for an event page, or null when the post has no venue.
 *
 * Google requires `location` on an Event and drops the whole item without
 * it: a post with no place (a league, an online contest) gets no Event at
 * all rather than a broken one. Dates are calendar days without a time: the
 * frontmatter has no hour, and the old `toISOString()` claimed midnight UTC,
 * which is 01:00 or 02:00 in Italy.
 */
export function eventJsonLd(data: JsonLdPost, site: URL): Record<string, unknown> | null {
  if (!data.venue?.name) return null;
  const startDate = isoDate(data.date);
  const lastDay = lastEventDay(data.events, startDate);
  const endDate = lastDay > startDate ? lastDay : undefined;
  const image = data.poster || data.featuredImage;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    startDate,
    ...(endDate ? { endDate } : {}),
    description: postDescription(data),
    location: {
      '@type': 'Place',
      name: data.venue.name,
      address: data.venue.address || data.venue.name,
    },
    ...(image ? { image: new URL(image, site).href } : {}),
    organizer: { '@type': 'Organization', name: 'VTES Italy', url: site.href },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };
}

/** schema.org `Article` for a post page. */
export function articleJsonLd(data: JsonLdPost, site: URL): Record<string, unknown> {
  const image = data.poster || data.featuredImage;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    datePublished: isoDate(data.date),
    dateModified: isoDate(data.date),
    description: postDescription(data),
    ...(data.tags?.length ? { keywords: data.tags.join(', ') } : {}),
    ...(image ? { image: new URL(image, site).href } : {}),
    author: { '@type': 'Organization', name: 'VTES Italy' },
    publisher: {
      '@type': 'Organization',
      name: 'VTES Italy',
      logo: { '@type': 'ImageObject', url: new URL('/images/logo.webp', site).href },
    },
  };
}
