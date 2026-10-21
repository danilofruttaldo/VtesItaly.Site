import type { CollectionEntry } from 'astro:content';
import { computeStageDisplayImages, stageDisplay } from './status';
import { translatePostSlug, translateSection, type Locale } from './i18n';
import { isoDate } from './date';
import { postEndDay } from './post';

/** Build the canonical post URL in the active locale. Centralises the slug
 *  rewrite so calendar timelines, city pages, and search results agree on
 *  what `/comunita/foo/` vs `/en/community/foo/` resolves to. */
export function postUrl(post: { id: string; data: { category: string } }, locale: Locale): string {
  if (locale === 'en') return getEnPostUrl(post);
  return `/${post.data.category}/${post.id}/`;
}

/** Builds the EN URL for a blog post, applying slug cleanup and category translation. */
export function getEnPostUrl(post: { id: string; data: { category: string } }): string {
  const itSection = post.data.category;
  const slug = translatePostSlug(itSection, post.id.replace(/-en$/, ''), 'en');
  return `/en/${translateSection(itSection, 'en')}/${slug}/`;
}

/** Returns the best card image for a post, checking tour stage images for a specific city. */
export function getCardImage(
  post: {
    data: {
      category: string;
      poster?: string;
      featuredImage?: string;
      stages?: { date: Date; cities?: string[]; image?: string; status?: string }[];
    };
  },
  citySlug: string,
): string | undefined {
  if (post.data.category === 'tour' && post.data.stages?.length) {
    const displayImages = computeStageDisplayImages(post.data.stages);
    const idx = post.data.stages.findIndex((s) => s.cities?.includes(citySlug));
    if (idx !== -1 && displayImages[idx]) return displayImages[idx];
  }
  return post.data.poster || post.data.featuredImage;
}

export interface CityCardEntry {
  href: string;
  title: string;
  image: string | undefined;
  date: Date;
  /** Last day (YYYY-MM-DD) of a multi-day event, for the past/next split. */
  endDate: string;
  category: string;
  tags: string[];
  excerpt: string;
  revealImage?: string; // see CalendarEvent.revealImage
  revealFrom?: string;
}

/** A calendar-only event (src/data/local-events.json), as the city cards need it. */
export interface CityLocalEvent {
  name: string;
  date: string; // YYYY-MM-DD
  city: string;
  venue?: string;
  image?: string;
}

/**
 * Build per-city card entries: expands Tour posts so each stage in `citySlug`
 * becomes its own card with the stage date and image. Non-tour posts stay as-is.
 * Calendar-only events of the city join as cards without a page (empty href),
 * as on the homepage timeline. Output sorted descending by date.
 */
export function buildCityCards(
  posts: CollectionEntry<'blog'>[],
  citySlug: string,
  hrefBuilder: (post: CollectionEntry<'blog'>) => string,
  localEvents: CityLocalEvent[] = [],
): CityCardEntry[] {
  const out: CityCardEntry[] = [];

  for (const post of posts) {
    if (!post.data.tags?.includes(citySlug)) continue;

    if (post.data.category === 'tour' && post.data.stages && post.data.stages.length > 0) {
      const yearShort = String(new Date(post.data.date).getUTCFullYear()).slice(2);
      const display = stageDisplay(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.cities?.includes(citySlug)) continue;
        if (!stage.date || stage.hideDate) continue;
        const stageImg = display[si].image;
        out.push({
          href: hrefBuilder(post),
          title: `IT${yearShort} - ${stage.name}`,
          image: stageImg || post.data.poster || post.data.featuredImage,
          date: new Date(stage.date),
          endDate: isoDate(new Date(stage.date)),
          category: post.data.category,
          tags: post.data.tags,
          excerpt: stage.description || post.data.excerpt,
          revealImage: display[si].revealImage,
          revealFrom: display[si].revealFrom,
        });
      }
      continue;
    }

    out.push({
      href: hrefBuilder(post),
      title: post.data.title,
      image: getCardImage(post, citySlug),
      date: new Date(post.data.date),
      endDate: postEndDay(post),
      category: post.data.category,
      tags: post.data.tags,
      excerpt: post.data.excerpt,
    });
  }

  for (const le of localEvents) {
    if (le.city !== citySlug) continue;
    const date = new Date(le.date);
    if (isNaN(date.getTime())) continue;
    out.push({
      href: '',
      title: le.name,
      image: le.image,
      date,
      endDate: le.date,
      category: 'local',
      tags: [],
      excerpt: le.venue ?? '',
    });
  }

  out.sort((a, b) => b.date.getTime() - a.date.getTime());
  return out;
}
