import { firstEventDay, isoDate, lastEventDay } from './date';

/** Page facts the post data does not carry: its URL, language and git days. */
export interface JsonLdPage {
  url: string;
  locale: 'it' | 'en';
  /** First and last commit day of the post file (utils/git-dates). */
  published?: string;
  modified?: string;
}

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
 * it: a post with no place (a league, an online contest whose venue is just
 * "Italia") gets no Event at all rather than a broken one. Dates are calendar days without a time: the
 * frontmatter has no hour, and the old `toISOString()` claimed midnight UTC,
 * which is 01:00 or 02:00 in Italy. The end day is always given (Google asks
 * for it), equal to the start for a single-day event.
 */
export function eventJsonLd(data: JsonLdPost, site: URL, page?: JsonLdPage): Record<string, unknown> | null {
  if (!data.venue?.name) return null;
  // "Italia" is no place: an online contest, not an event to attend.
  if (/^ital(ia|y)$/i.test((data.venue.address || data.venue.name).trim())) return null;
  const startDate = firstEventDay(data.events, isoDate(data.date));
  const endDate = lastEventDay(data.events, isoDate(data.date));
  const image = data.poster || data.featuredImage;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    startDate,
    endDate,
    description: postDescription(data),
    ...(page ? { url: page.url, inLanguage: page.locale } : {}),
    location: {
      '@type': 'Place',
      name: data.venue.name,
      address: postalAddress(data.venue.address || data.venue.name),
    },
    ...(image ? { image: new URL(image, site).href } : {}),
    organizer: { '@type': 'Organization', name: 'VTES Italy', url: site.href },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };
}

/**
 * schema.org `PostalAddress` from a free-text address. The town is the part
 * after the last comma (or dash), with its optional postal code before it and
 * province after it: "Via X 1, 40127 Bologna (BO)", "Via X 1 – 40132 Bologna
 * (BO)", "Via X 1, Bologna", "38057 Pergine Valsugana (TN)". Text that does
 * not end with a town stays whole as the street address.
 */
export function postalAddress(address: string): Record<string, string> {
  const out: Record<string, string> = { '@type': 'PostalAddress', addressCountry: 'IT' };
  const text = address.replace(/,\s*Ital(y|ia)$/i, '').trim();
  const cut = Math.max(text.lastIndexOf(','), text.lastIndexOf(' – '), text.lastIndexOf(' - '));
  const street = cut === -1 ? '' : text.slice(0, cut).trim();
  const tail = (cut === -1 ? text : text.slice(cut + 1).replace(/^[–-]\s*/, '')).trim();
  const m = /^(?:(\d{5})\s+)?([^\d(),]+?)(?:\s*\(([A-Z]{2})\))?$/.exec(tail);
  if (m && (m[1] || m[3] || street)) {
    if (street) out.streetAddress = street;
    if (m[1]) out.postalCode = m[1];
    out.addressLocality = m[2];
    if (m[3]) out.addressRegion = m[3];
  } else {
    out.streetAddress = text;
  }
  return out;
}

/**
 * Publication day of a post: the earlier of its first commit and its date
 * (posts older than the repository were imported in 2026, so their first
 * commit is not when they went up), never later than `today` (an announced
 * event is dated on its future day). Shared by the JSON-LD and the
 * `article:published_time` meta, which must agree.
 */
export function publishedDay(postDate: Date, firstCommit: string | undefined, today: string = todayIso()): string {
  const postDay = isoDate(postDate);
  const day = firstCommit && firstCommit < postDay ? firstCommit : postDay;
  return day < today ? day : today;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** schema.org `Article` for a post page, dated by `publishedDay` and its last commit. */
export function articleJsonLd(
  data: JsonLdPost,
  site: URL,
  page?: JsonLdPage,
  today: string = todayIso(),
): Record<string, unknown> {
  const image = data.poster || data.featuredImage;
  const published = publishedDay(data.date, page?.published, today);
  const modified = page?.modified && page.modified > published ? page.modified : published;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    datePublished: published,
    dateModified: modified,
    ...(page ? { inLanguage: page.locale, mainEntityOfPage: { '@type': 'WebPage', '@id': page.url } } : {}),
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
