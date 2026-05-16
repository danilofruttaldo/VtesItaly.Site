import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';
import { localePrefix, useTranslations } from './i18n';
import { computeStageDisplayImages } from './status';
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

/** Pick the post-level image: poster-first for tournament categories, otherwise featured-first. */
function pickPostImage(post: CollectionEntry<'blog'>): string | undefined {
  const cat = post.data.category;
  const usesPoster = cat === 'grand-prix' || cat === 'nazionale';
  return usesPoster ? post.data.poster || post.data.featuredImage : post.data.featuredImage || post.data.poster;
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
        : ', Proxy Ammesse'
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
    const image = pickPostImage(post);

    // Tour stages
    if (post.data.stages && post.data.stages.length > 0) {
      const displayImages = computeStageDisplayImages(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.date) continue;
        if (stage.hideDate) continue;
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
          image: displayImages[si] || image,
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
        };

        // Start date entry — for community posts, use the post title when:
        //   - it's a single event (the event IS the post), or
        //   - all events share the same name (multi-day event split across calendar cells).
        // Otherwise fall back to the event's own name (e.g. league nights).
        const allSameName =
          post.data.events!.length > 1 && post.data.events!.every((e) => e.name === post.data.events![0].name);
        const useTitle = category === 'comunita' && (post.data.events!.length === 1 || allSameName);
        const displayName = useTitle ? postTitle : ev.name;
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
    });
  }

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events;
}

/**
 * Lightweight timeline entry for the homepage "community events" section.
 * One entry per tour stage; one entry per non-tour post anchored at
 * `post.data.date` (multi-day side events are NOT split into separate cards).
 */
export interface TimelineEntry {
  date: string; // YYYY-MM-DD
  title: string;
  url: string;
  category: string;
  image?: string;
  imageAnchor?: string;
  tags: string[];
  excerpt?: string;
}

/** Pick `object-position` for the card thumbnail / timeline image.
 *  Honors an explicit `imageAnchor` from the post's frontmatter; otherwise
 *  anchors left for `type: 'altro'` events whose featured image is typically
 *  a wide-landscape social-kit composition. */
function pickImageAnchor(post: CollectionEntry<'blog'>): string | undefined {
  if (post.data.imageAnchor) return post.data.imageAnchor;
  const events = post.data.events;
  if (events && events.length > 0 && events.every((e) => e.type === 'altro')) {
    return 'left center';
  }
  return undefined;
}

/**
 * Build the community events timeline from blog posts + local events.
 * Tour posts emit one entry per stage; all other posts emit a single entry
 * anchored at `post.data.date` — same logic as the comunita/principato pages,
 * so multi-day events (GP, NC, leagues) show as one card, not per side event.
 */
export function getCommunityTimeline(posts: CollectionEntry<'blog'>[], locale: Locale): TimelineEntry[] {
  const out: TimelineEntry[] = [];

  for (const post of posts) {
    const url = postUrl(post, locale);
    const category = post.data.category;
    const tags = post.data.tags || [];
    const excerpt = post.data.excerpt;
    const baseImage = pickPostImage(post);
    const imageAnchor = pickImageAnchor(post);

    if (post.data.stages && post.data.stages.length > 0) {
      const displayImages = computeStageDisplayImages(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.date || stage.hideDate) continue;
        const d = new Date(stage.date);
        if (d.getDate() === 1 && !stage.time) continue;
        const yearShort = String(d.getFullYear()).slice(2);
        out.push({
          date: toIsoDate(d),
          title: `IT${yearShort} — ${stage.name}`,
          url,
          category,
          image: displayImages[si] || baseImage,
          imageAnchor,
          tags,
          excerpt: stage.description || excerpt,
        });
      }
      continue;
    }

    const postDate = new Date(post.data.date);
    if (isNaN(postDate.getTime())) continue;
    out.push({
      date: toIsoDate(postDate),
      title: post.data.title,
      url,
      category,
      image: baseImage,
      imageAnchor,
      tags,
      excerpt,
    });
  }

  // Local events (no post page; links resolve to empty)
  const localEvents = localEventsData as LocalEvent[];
  for (const le of localEvents) {
    const d = new Date(le.date);
    if (isNaN(d.getTime())) continue;
    const cityName = le.city.charAt(0).toUpperCase() + le.city.slice(1);
    const leExcerpt = le.venue ? `${cityName} — ${le.venue}` : cityName;
    out.push({
      date: le.date,
      title: le.name,
      url: '',
      category: 'local',
      image: le.image,
      tags: [],
      excerpt: leExcerpt,
    });
  }

  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export interface TimelineWindow {
  /** Visual order top-down: future-most-distant → next → past-most-recent → past-older. */
  entries: TimelineEntry[];
  /** Index inside `entries` of the "next event" card (the one to highlight). -1 when no upcoming. */
  highlightIndex: number;
}

/**
 * Pick 5 entries centered on the next upcoming event:
 *   - 2 entries above (further future, farthest first)
 *   - 1 "next" entry (highlighted)
 *   - 2 entries below (recent past, most recent first)
 * Falls back to the other side when one side is short.
 */
export function pickTimelineWindow(entries: TimelineEntry[], today: string): TimelineWindow {
  if (entries.length === 0) return { entries: [], highlightIndex: -1 };

  const pivot = entries.findIndex((e) => e.date >= today);
  if (pivot === -1) {
    // No upcoming — show the 5 most recent past, newest at top, no highlight.
    const tail = entries.slice(-5).reverse();
    return { entries: tail, highlightIndex: -1 };
  }

  const idealAbove = 2;
  const idealBelow = 2;

  let above = entries.slice(pivot + 1, pivot + 1 + idealAbove);
  let below = entries.slice(Math.max(0, pivot - idealBelow), pivot);

  const aboveShort = idealAbove - above.length;
  const belowShort = idealBelow - below.length;

  if (aboveShort > 0) {
    below = entries.slice(Math.max(0, pivot - idealBelow - aboveShort), pivot);
  }
  if (belowShort > 0) {
    above = entries.slice(pivot + 1, pivot + 1 + idealAbove + belowShort);
  }

  const display = [...above.slice().reverse(), entries[pivot], ...below.slice().reverse()];
  return { entries: display, highlightIndex: above.length };
}
