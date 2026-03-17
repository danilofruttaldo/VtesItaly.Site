import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';
import { localePrefix, useTranslations } from './i18n';

export interface CalendarEvent {
  id: string;
  date: string;       // ISO date string YYYY-MM-DD
  endDate?: string;   // ISO date string YYYY-MM-DD (for range events)
  time: string;       // "09:00" or ""
  title: string;
  postTitle: string;
  category: string;
  url: string;
  venue?: string;
  location?: string;
  format?: string;
  image?: string;     // featured image or poster URL
  archonUrl?: string; // Archon or BCN Crisis link
  tags?: string[];    // post tags for sub-category coloring
  cardHidden?: boolean; // hide "read" CTA and don't link to page
}

/** Build the page URL for a post in a given locale */
function postUrl(post: CollectionEntry<'blog'>, locale: Locale): string {
  const prefix = localePrefix(locale);
  const id = post.id;

  if (locale === 'en') {
    const cleanSlug = id.replace(/-en$/, '');
    const cat = post.data.category;
    if (cat === 'nazionale') {
      return `${prefix}/national-championship/${cleanSlug.replace('nazionale-', 'nc-')}/`;
    }
    if (cat === 'comunita') {
      return `${prefix}/community/${cleanSlug}/`;
    }
    return `${prefix}/${cat}/${cleanSlug}/`;
  }

  return `/${post.data.category}/${id}/`;
}

/** Format a Date to YYYY-MM-DD */
function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Extract a flat list of calendar events from blog posts.
 * Handles: stages (tour), events array (GP/NC/community), skips leagues without dates.
 */
export function extractCalendarEvents(posts: CollectionEntry<'blog'>[], locale: Locale): CalendarEvent[] {
  const t = useTranslations(locale);
  const events: CalendarEvent[] = [];

  for (const post of posts) {
    const url = postUrl(post, locale);
    const category = post.data.category;
    const postTitle = post.data.title;
    const venue = post.data.venue?.name;
    const location = post.data.venue?.address;
    const usesPoster = category === 'grand-prix' || category === 'nazionale';
    const image = usesPoster
      ? (post.data.poster || post.data.featuredImage)
      : (post.data.featuredImage || post.data.poster);

    // Tour stages
    if (post.data.stages && post.data.stages.length > 0) {
      for (const stage of post.data.stages) {
        if (!stage.date) continue;
        const d = new Date(stage.date);
        // Skip placeholder dates (1st of month without confirmed time)
        if (d.getDate() === 1 && !stage.time) continue;
        const yearShort = String(d.getFullYear()).slice(2);
        events.push({
          id: `${category}/${post.id}/${toIsoDate(d)}`,
          date: toIsoDate(d),
          time: stage.time || 'TBD',
          title: `IT${yearShort} — ${stage.name}`,
          postTitle,
          category,
          url,
          venue: stage.venue || stage.cities?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || 'TBD',
          location: stage.location || 'TBD',
          image: (stage as any).image || image,
          archonUrl: stage.archonUrl,
        });
      }
    }

    // Events array (GP, NC, community events)
    if (post.data.events && post.data.events.length > 0) {
      for (const ev of post.data.events) {
        // Skip league period entries (they have period set, or date is not parseable)
        if (ev.period) continue;
        const d = new Date(ev.date);
        if (isNaN(d.getTime())) continue;
        // Skip placeholder dates (1st of month without confirmed time)
        if (d.getDate() === 1 && (!ev.time || ev.time === '—')) continue;
        const isTournament = category === 'grand-prix' || category === 'nazionale' || category === 'tour';
        const endD = ev.endDate ? new Date(ev.endDate) : null;
        const hasEndDate = endD && !isNaN(endD.getTime()) && toIsoDate(endD) !== toIsoDate(d);

        const tags = post.data.tags || [];
        const baseEvent = {
          postTitle,
          category,
          url,
          tags,
          venue: venue || (isTournament ? 'TBD' : undefined),
          location: location || (isTournament ? 'TBD' : undefined),
          format: ev.format,
          image,
          archonUrl: ev.archonUrl,
          cardHidden: post.data.cardHidden || false,
        };

        // Start date entry — for single-event community posts, use the post title
        const displayName = (category === 'comunita' && post.data.events!.length === 1) ? postTitle : ev.name;
        const startTitle = hasEndDate ? `${t.calendar.starts}: ${displayName}` : displayName;
        events.push({
          ...baseEvent,
          id: `${category}/${post.id}/${toIsoDate(d)}`,
          date: toIsoDate(d),
          endDate: hasEndDate ? toIsoDate(endD) : undefined,
          time: ev.time === '—' ? (isTournament ? 'TBD' : '') : (ev.time || (isTournament ? 'TBD' : '')),
          title: startTitle,
        });

        // End date entry (separate calendar cell)
        if (hasEndDate) {
          events.push({
            ...baseEvent,
            id: `${category}/${post.id}/${toIsoDate(endD)}`,
            date: toIsoDate(endD),
            endDate: toIsoDate(endD),
            time: '',
            title: `${t.calendar.ends}: ${displayName}`,
          });
        }
      }
    }
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}