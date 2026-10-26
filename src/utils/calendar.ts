import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';
import { useTranslations } from './i18n';
import { resolvePlatformLabel, stageDisplay } from './status';
import { postUrl } from './url';
import { imageFocus, squarestImage } from './image';
import { isoDate } from './date';
import { timelineWindow } from './timeline';
import { isLeaguePost, postEndDay } from './post';

export { isLeaguePost, postEndDay };
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
  // True when `image` is not a poster (principato header, photo): the popup
  // crops it to fill the frame instead of letterboxing it.
  imageFill?: boolean;
  // `object-position` of a filled image: its point of interest (utils/image imageFocus).
  imagePosition?: string;
  archonUrl?: string; // Archon or BCN Crisis link
  platform?: string; // label of the archonUrl button ("Archon", "BCN Crisis")
  tags?: string[]; // post tags for sub-category coloring
  // Tour stage still on the placeholder at build time: the real cover and the
  // day (YYYY-MM-DD) the browser swaps it in.
  revealImage?: string;
  revealFrom?: string;
}

/**
 * `time: 'tbd'` in the frontmatter: the event has a day but no announced
 * start time. Tournaments then show "to be defined", other events no time.
 */
export const TIME_TBD = 'tbd';

/** Calendar `time` value the browser script prints as the localized "to be defined". */
const CAL_TIME_TBD = 'TBD';

/** Pick the post-level image: the one closest to square (see `squarestImage`); on a
 *  tie, poster-first for tournament categories, otherwise featured-first. */
function pickPostImage(post: CollectionEntry<'blog'>): string | undefined {
  const cat = post.data.category;
  const usesPoster = cat === 'grand-prix' || cat === 'nazionale';
  return usesPoster
    ? squarestImage(post.data.poster, post.data.featuredImage)
    : squarestImage(post.data.featuredImage, post.data.poster);
}

const KNOWN_FORMATS = ['Standard', 'V5', 'Limited', 'Draft', 'Storyline', 'TBD'];

/** "Da definire" / "TBD": the format is not announced yet. */
function tbd(locale: Locale): string {
  return useTranslations(locale).calendar.tbd;
}

export function composeFormat(
  format: string | undefined,
  proxies: boolean | undefined,
  rounds: number | undefined,
  locale: Locale,
): string | undefined {
  if (!format) return tbd(locale);
  if (!KNOWN_FORMATS.includes(format)) return locale === 'en' ? 'Special' : 'Speciale';
  if (format === 'TBD') return tbd(locale);
  let s = format;
  if (proxies !== undefined) s += `, ${proxiesLabel(proxies, locale)}`;
  if (rounds) s += ` - ${roundsLabel(rounds, locale)}`;
  return s;
}

/** "Proxy Ammesse" / "No Proxy". Split out of `composeFormat` for events whose
 *  format is not announced yet but whose proxy policy is. */
export function proxiesLabel(proxies: boolean, locale: Locale): string {
  if (locale === 'en') return proxies ? 'Proxies Allowed' : 'No Proxies';
  return proxies ? 'Proxy Ammesse' : 'No Proxy';
}

/** Format line for a single event, shared by the event page and the calendar
 *  popup so the two never disagree. Falls back to the proxy policy and round
 *  structure when the format itself is not announced yet; returns undefined
 *  when nothing at all is known (callers decide what to print instead). */
export function composeEventLine(
  ev: { format?: string; proxies?: boolean; rounds?: number },
  locale: Locale,
): string | undefined {
  if (ev.format) return composeFormat(ev.format, ev.proxies, ev.rounds, locale);
  const parts: string[] = [];
  if (ev.proxies !== undefined) parts.push(proxiesLabel(ev.proxies, locale));
  if (ev.rounds) parts.push(roundsLabel(ev.rounds, locale));
  return parts.length > 0 ? parts.join(' - ') : undefined;
}

/** "3 Round + Finale" / "3 Rounds + Final". Split out of `composeFormat` so the
 *  round count can also stand alone, for events whose format is not announced
 *  yet but whose structure is. */
export function roundsLabel(rounds: number, locale: Locale): string {
  return locale === 'en' ? `${rounds} Round${rounds > 1 ? 's' : ''} + Final` : `${rounds} Round + Finale`;
}

/**
 * Extract a flat list of calendar events from blog posts.
 * Handles: stages (tour) and the events array (GP/NC/community). League posts
 * are skipped entirely (see `isLeaguePost`).
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
    const imageFill = !!image && image !== post.data.poster;

    // Tour stages
    if (post.data.stages && post.data.stages.length > 0) {
      const display = stageDisplay(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.date) continue;
        if (stage.hideDate || stage.cancelled) continue;
        const d = new Date(stage.date);
        // Skip placeholder dates (1st of month without confirmed time)
        if (d.getUTCDate() === 1 && (!stage.time || stage.time === TIME_TBD)) continue;
        const yearShort = String(d.getUTCFullYear()).slice(2);
        events.push({
          id: `${category}/${post.id}/${isoDate(d)}`,
          date: isoDate(d),
          time: stage.time && stage.time !== TIME_TBD ? stage.time : CAL_TIME_TBD,
          title: `IT${yearShort} - ${stage.name}`,
          postTitle,
          category,
          url,
          venue: stage.venue,
          location: stage.location,
          format: composeFormat(stage.format, stage.proxies, stage.rounds, locale),
          image: display[si].image || image,
          imageFill: !display[si].image && imageFill,
          imagePosition: !display[si].image && imageFill ? imageFocus(image) : undefined,
          archonUrl: stage.archonUrl,
          revealImage: display[si].revealImage,
          revealFrom: display[si].revealFrom,
        });
      }
    }

    // Events array (GP, NC, community events). League game days never enter.
    if (!isLeaguePost(post) && post.data.events && post.data.events.length > 0) {
      for (const ev of post.data.events) {
        // Skip league period entries (they have period set, or date is not parseable)
        if (ev.period) continue;
        const d = new Date(ev.date);
        if (isNaN(d.getTime())) continue;
        // Skip placeholder dates (1st of month without confirmed time)
        if (d.getUTCDate() === 1 && (!ev.time || ev.time === TIME_TBD)) continue;
        const isTournament = category === 'grand-prix' || category === 'nazionale' || category === 'tour';
        const endD = ev.endDate ? new Date(ev.endDate) : null;
        const hasEndDate = endD && !isNaN(endD.getTime()) && isoDate(endD) !== isoDate(d);

        const tags = post.data.tags || [];
        const isAltro = ev.type === 'altro';
        const baseEvent = {
          postTitle,
          category: isAltro ? 'altro' : category,
          url,
          tags,
          // Per-day venue override wins over the post-level one (multi-venue
          // weekends); the address falls back with it so the two stay paired.
          venue: ev.venue ?? venue,
          location: ev.venue ? ev.location : location,
          format: isAltro ? undefined : (composeEventLine(ev, locale) ?? tbd(locale)),
          description: isAltro ? post.data.excerpt : undefined,
          image,
          imageFill,
          imagePosition: imageFill ? imageFocus(image) : undefined,
          archonUrl: ev.archonUrl,
        };

        // Start date entry. For community posts, use the post title when:
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
          id: `${category}/${post.id}/${isoDate(d)}`,
          date: isoDate(d),
          endDate: hasEndDate ? isoDate(endD) : undefined,
          time: ev.time && ev.time !== TIME_TBD ? ev.time : isTournament ? CAL_TIME_TBD : '',
          title: startTitle,
        });

        // End date entry (separate calendar cell)
        if (hasEndDate) {
          events.push({
            ...baseEvent,
            id: `${category}/${post.id}/${isoDate(endD)}`,
            date: isoDate(endD),
            endDate: isoDate(endD),
            time: '',
            title: `${t.calendar.ends}: ${displayName}`,
          });
        }
      }
    }
  }

  // A Tour stage played as a GP/NC side event is in both posts: one entry per
  // tournament (same day, same Archon link), the GP/NC one, which carries
  // the weekend's venue and schedule.
  const byTournament = new Map<string, CalendarEvent>();
  const deduped: CalendarEvent[] = [];
  for (const e of events) {
    if (!e.archonUrl) {
      deduped.push(e);
      continue;
    }
    const key = `${e.date} ${e.archonUrl}`;
    const seen = byTournament.get(key);
    if (!seen) {
      byTournament.set(key, e);
      deduped.push(e);
    } else if (seen.category === 'tour' && e.category !== 'tour') {
      deduped[deduped.indexOf(seen)] = e;
      byTournament.set(key, e);
    }
  }
  events.length = 0;
  events.push(...deduped);

  // Same platform label as the event pages (resolvePlatformLabel)
  for (const e of events) {
    if (!e.archonUrl) continue;
    const label = resolvePlatformLabel(e.archonUrl);
    e.platform = label === e.archonUrl ? 'Archon' : label;
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
  date: string; // YYYY-MM-DD, start day
  endDate?: string; // YYYY-MM-DD, last day of a multi-day event; absent for single-day
  title: string;
  url: string;
  category: string;
  image?: string;
  imageAnchor?: string;
  tags: string[];
  excerpt?: string;
  revealImage?: string; // see CalendarEvent.revealImage
  revealFrom?: string;
}

/** `object-position` for the card image: only an explicit `imageAnchor` from the
 *  frontmatter. Otherwise the card shows the square thumb, already cut around
 *  the image's point of interest (scripts/build-thumbnails.mjs). */
function pickImageAnchor(post: CollectionEntry<'blog'>): string | undefined {
  return post.data.imageAnchor;
}

/** Last day of a multi-day post, undefined when single-day (see `postEndDay`). */
function pickTimelineEndDate(post: CollectionEntry<'blog'>, start: string): string | undefined {
  const last = postEndDay(post);
  return last > start ? last : undefined;
}

/**
 * Build the community events timeline from blog posts.
 * Tour posts emit one entry per stage; all other posts emit a single entry
 * anchored at `post.data.date`, the same logic as the comunita/principato pages,
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
      const display = stageDisplay(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.date || stage.hideDate || stage.cancelled) continue;
        const d = new Date(stage.date);
        if (d.getUTCDate() === 1 && (!stage.time || stage.time === TIME_TBD)) continue;
        const yearShort = String(d.getUTCFullYear()).slice(2);
        out.push({
          date: isoDate(d),
          title: `IT${yearShort} - ${stage.name}`,
          url,
          category,
          image: display[si].image || baseImage,
          imageAnchor,
          tags,
          excerpt: stage.description || excerpt,
          revealImage: display[si].revealImage,
          revealFrom: display[si].revealFrom,
        });
      }
      continue;
    }

    const postDate = new Date(post.data.date);
    if (isNaN(postDate.getTime())) continue;
    const startIso = isoDate(postDate);
    out.push({
      date: startIso,
      endDate: pickTimelineEndDate(post, startIso),
      title: post.data.title,
      url,
      category,
      image: baseImage,
      imageAnchor,
      tags,
      excerpt,
    });
  }

  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export interface TimelineWindow {
  /** Visual order top-down: future-most-distant → next → past-most-recent → past-older. */
  entries: TimelineEntry[];
  /** Index inside `entries` of the first "next event" card. -1 when no upcoming. */
  highlightIndex: number;
  /** Indices of every "next event" card: all those starting that same day. Empty when no upcoming. */
  highlightIndices: number[];
}

/** The homepage window over the timeline: see `timelineWindow`. */
export function pickTimelineWindow(entries: TimelineEntry[], today: string): TimelineWindow {
  return timelineWindow(entries, today, (e) => e);
}
