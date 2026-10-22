import { createHash } from 'node:crypto';
import type { CalendarEvent } from './calendar';

/**
 * Mapping from the site calendar (dist/api/calendar-events-it.json) to Google
 * Calendar events, and the diff that `scripts/sync-gcal.mjs` applies after
 * each deploy. The site stays the only source: events created by hand on the
 * Google calendar are never touched, because the sync lists only the events
 * tagged with `GCAL_SOURCE`.
 */

export const GCAL_SOURCE = 'vtesitaly';
export const GCAL_TIMEZONE = 'Europe/Rome';

/** Single-day events with a start time but no end: Google needs one. */
const DEFAULT_HOURS = 6;

type GcalTime = { date: string } | { dateTime: string; timeZone: string };

export interface GcalEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
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

/** "09:30" or "9:00 – 19:00" → start (and end) as HH:MM; null for "", "TBD" and free text. */
export function parseTime(time: string): { start: string; end?: string } | null {
  const m = /^(\d{1,2}):(\d{2})(?:\s*[–-]\s*(\d{1,2}):(\d{2}))?$/.exec(time.trim());
  if (!m) return null;
  const pad = (h: string) => h.padStart(2, '0');
  return { start: `${pad(m[1])}:${m[2]}`, end: m[3] ? `${pad(m[3])}:${m[4]}` : undefined };
}

/** YYYY-MM-DD plus `days`, on the calendar (no timezone involved). */
function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Wall-clock "YYYY-MM-DDTHH:MM:00" plus `hours`, rolling over midnight. */
function addHours(date: string, time: string, hours: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh + hours, mm)).toISOString().slice(0, 19);
}

function timing(ev: CalendarEvent): { start: GcalTime; end: GcalTime } {
  const t = parseTime(ev.time);
  // Multi-day events and days without a start time are all-day: Google's
  // end date is exclusive, hence the extra day.
  if (ev.endDate || !t) {
    return { start: { date: ev.date }, end: { date: addDays(ev.endDate ?? ev.date, 1) } };
  }
  const start = `${ev.date}T${t.start}:00`;
  const end = t.end && t.end > t.start ? `${ev.date}T${t.end}:00` : addHours(ev.date, t.start, DEFAULT_HOURS);
  return {
    start: { dateTime: start, timeZone: GCAL_TIMEZONE },
    end: { dateTime: end, timeZone: GCAL_TIMEZONE },
  };
}

/** "Circolo Barbanera, Via Ranzani 13, Bologna": the venue only when the address doesn't already name it. */
function place(ev: CalendarEvent): string | undefined {
  const { venue, location } = ev;
  if (venue && location && !location.includes(venue)) return `${venue}, ${location}`;
  return location || venue || undefined;
}

/**
 * Google events for the site calendar. The site splits a multi-day event into
 * a "Starts:" and an "Ends:" cell; Google gets a single event across the days.
 */
export function toGcalEvents(events: CalendarEvent[], opts: GcalOptions): GcalEvent[] {
  const out: GcalEvent[] = [];
  const prefix = `${opts.startsPrefix}: `;
  // Site ids are post + day, so two side events on the same day share one:
  // the second and later get their position appended.
  const seen = new Map<string, number>();
  for (const ev of events) {
    // The "Ends:" cell of a multi-day event: covered by its start entry.
    if (ev.endDate && ev.endDate === ev.date) continue;
    const n = (seen.get(ev.id) ?? 0) + 1;
    seen.set(ev.id, n);
    const key = n === 1 ? ev.id : `${ev.id}#${n}`;
    const summary = ev.endDate && ev.title.startsWith(prefix) ? ev.title.slice(prefix.length) : ev.title;
    const pageUrl = ev.url ? opts.siteUrl + ev.url : undefined;
    const lines = [ev.description ?? ev.format, ev.archonUrl && `${ev.platform ?? 'Archon'}: ${ev.archonUrl}`, pageUrl];
    const body: Omit<GcalEvent, 'extendedProperties'> = {
      id: gcalId(key),
      summary,
      description: lines.filter(Boolean).join('\n') || undefined,
      location: place(ev),
      ...timing(ev),
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
