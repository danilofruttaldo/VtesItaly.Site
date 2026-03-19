import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';
import { localePrefix, useTranslations } from './i18n';
import localEventsData from '../data/local-events.json';

export interface LocalEvent {
  name: string;
  date: string; // YYYY-MM-DD
  city: string;
  time?: string;
  venue?: string;
  location?: string;
  format?: string;
  proxies?: boolean;
  rounds?: number;
  archonUrl?: string;
  image?: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  endDate?: string; // ISO date string YYYY-MM-DD (for range events)
  time: string; // "09:00" or ""
  title: string;
  postTitle: string;
  category: string;
  url: string;
  venue?: string;
  location?: string;
  format?: string;
  description?: string; // shown in popup instead of format
  image?: string; // featured image or poster URL
  archonUrl?: string; // Archon or BCN Crisis link
  tags?: string[]; // post tags for sub-category coloring
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

const KNOWN_FORMATS = ['Standard', 'V5', 'Limited', 'Draft', 'TBD'];

export function composeFormat(
  format: string | undefined,
  proxies: boolean | undefined,
  rounds: number | undefined,
  locale: Locale,
): string | undefined {
  if (!format) return 'TBD';
  if (!KNOWN_FORMATS.includes(format)) return locale === 'en' ? 'Special' : 'Speciale';
  if (format === 'TBD') return 'TBD';
  let s = format;
  if (proxies !== undefined) {
    s += proxies
      ? locale === 'en'
        ? ', Proxies Allowed'
        : ', Proxy Ammessi'
      : locale === 'en'
        ? ', No Proxies'
        : ', No Proxy';
  }
  if (rounds) {
    s += locale === 'en' ? ` — ${rounds} Round${rounds > 1 ? 's' : ''} + Final` : ` — ${rounds} Round + Finale`;
  }
  return s;
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
      ? post.data.poster || post.data.featuredImage
      : post.data.featuredImage || post.data.poster;

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
          venue: stage.venue,
          location: stage.location,
          format: composeFormat(stage.format, stage.proxies, stage.rounds, locale),
          image: stage.image || image,
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
        const isAltro = ev.type === 'altro';
        const baseEvent = {
          postTitle,
          category: isAltro ? 'altro' : category,
          url,
          tags,
          venue: venue,
          location: location,
          format: isAltro ? undefined : composeFormat(ev.format, ev.proxies, ev.rounds, locale),
          description: isAltro ? post.data.excerpt : undefined,
          image,
          archonUrl: ev.archonUrl,
          cardHidden: post.data.cardHidden || false,
        };

        // Start date entry — for single-event community posts, use the post title
        const displayName = category === 'comunita' && post.data.events!.length === 1 ? postTitle : ev.name;
        const startTitle = hasEndDate ? `${t.calendar.starts}: ${displayName}` : displayName;
        events.push({
          ...baseEvent,
          id: `${category}/${post.id}/${toIsoDate(d)}`,
          date: toIsoDate(d),
          endDate: hasEndDate ? toIsoDate(endD) : undefined,
          time: ev.time === '—' ? (isTournament ? 'TBD' : '') : ev.time || (isTournament ? 'TBD' : ''),
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

  // Local events (calendar-only, no dedicated page)
  const localEvents = localEventsData as LocalEvent[];
  for (const le of localEvents) {
    const d = new Date(le.date);
    if (isNaN(d.getTime())) continue;
    events.push({
      id: `local/${le.city}/${le.date}`,
      date: le.date,
      time: le.time || 'TBD',
      title: le.name,
      postTitle: le.name,
      category: 'local',
      url: '',
      venue: le.venue || le.city.charAt(0).toUpperCase() + le.city.slice(1),
      location: le.location,
      format: composeFormat(le.format, le.proxies, le.rounds, locale),
      archonUrl: le.archonUrl,
      image: le.image,
      cardHidden: true,
    });
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}
