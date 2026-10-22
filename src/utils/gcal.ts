import { createHash } from 'node:crypto';
import type { CalendarEvent } from './calendar';
import { eventDetails, eventPageUrl, eventPlace, eventSummary, eventTiming, type GcalTime } from './gcal-event.ts';

/**
 * Mapping from the site calendar (dist/api/calendar-events-it.json) to Google
 * Calendar events, and the diff that `scripts/sync-gcal.mjs` applies after
 * each deploy. The site stays the only source: events created by hand on the
 * Google calendar are never touched, because the sync lists only the events
 * tagged with `GCAL_SOURCE`. Timing, place and description come from
 * ./gcal-event.ts, shared with the popup's "add to Google Calendar" link.
 */

export const GCAL_SOURCE = 'vtesitaly';

export interface GcalEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  colorId: string;
  start: GcalTime;
  end: GcalTime;
  source?: { title: string; url: string };
  extendedProperties: { private: { source: string; hash: string } };
}

/** What the sync needs of an event already on the Google calendar. */
export interface GcalExisting {
  id: string;
  extendedProperties?: { private?: { hash?: string } };
}

export interface GcalOptions {
  /** Absolute site origin, no trailing slash: "https://vtesitaly.com". */
  siteUrl: string;
  /** Localized "Starts" prefix that the site puts on multi-day titles. */
  startsPrefix: string;
}

/**
 * Google event ids allow only base32hex (0-9, a-v), 5 to 1024 chars: a hex
 * digest of the site id fits and stays the same across builds, so an event
 * is updated in place instead of duplicated.
 */
export function gcalId(siteId: string): string {
  return createHash('sha256').update(siteId).digest('hex').slice(0, 32);
}

/**
 * Google's event palette (`colorId`, no custom hex) closest to the site
 * calendar colors (eventColor in Calendar.astro): Tomato for GP, Basil for
 * the Tour, Banana for the NC, Peacock for tournaments, Grape for the rest.
 */
export function gcalColor(ev: Pick<CalendarEvent, 'category' | 'tags'>): string {
  if (ev.category === 'grand-prix') return '11';
  if (ev.category === 'tour') return '10';
  if (ev.category === 'nazionale') return '5';
  if (ev.category === 'local') return '7';
  if (ev.category === 'comunita') {
    const tags = ev.tags ?? [];
    return tags.includes('contest') || tags.includes('prerelease') ? '3' : '7';
  }
  return '3';
}

/**
 * Google events for the site calendar. The site splits a multi-day event into
 * a "Starts:" and an "Ends:" cell; Google gets a single event across the days.
 */
export function toGcalEvents(events: CalendarEvent[], opts: GcalOptions): GcalEvent[] {
  const out: GcalEvent[] = [];
  // Site ids are post + day, so two side events on the same day share one:
  // the second and later get their position appended.
  const seen = new Map<string, number>();
  for (const ev of events) {
    // The "Ends:" cell of a multi-day event: covered by its start entry.
    if (ev.endDate && ev.endDate === ev.date) continue;
    const n = (seen.get(ev.id) ?? 0) + 1;
    seen.set(ev.id, n);
    const key = n === 1 ? ev.id : `${ev.id}#${n}`;
    const pageUrl = eventPageUrl(ev, opts.siteUrl);
    const body: Omit<GcalEvent, 'extendedProperties'> = {
      id: gcalId(key),
      summary: eventSummary(ev, opts.startsPrefix),
      description: eventDetails(ev, opts.siteUrl),
      location: eventPlace(ev),
      colorId: gcalColor(ev),
      ...eventTiming(ev),
      source: pageUrl ? { title: 'VTES Italy', url: pageUrl } : undefined,
    };
    const hash = createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 16);
    out.push({ ...body, extendedProperties: { private: { source: GCAL_SOURCE, hash } } });
  }
  return out;
}

export interface GcalPlan {
  insert: GcalEvent[];
  update: GcalEvent[];
  remove: string[];
}

/** What to change on Google so that it matches the site: new, changed (by hash), gone. */
export function planSync(desired: GcalEvent[], existing: GcalExisting[]): GcalPlan {
  const current = new Map(existing.map((e) => [e.id, e.extendedProperties?.private?.hash]));
  const wanted = new Set(desired.map((e) => e.id));
  return {
    insert: desired.filter((e) => !current.has(e.id)),
    update: desired.filter((e) => current.has(e.id) && current.get(e.id) !== e.extendedProperties.private.hash),
    remove: existing.filter((e) => !wanted.has(e.id)).map((e) => e.id),
  };
}
