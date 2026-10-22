/**
 * How a site calendar event reads on Google Calendar: timing, place, title
 * and description. Shared by the sync (./gcal.ts, Node) and by the "add to
 * Google Calendar" button of the calendar popup (browser), so the event a
 * visitor saves matches the one on the public calendar. No Node imports here.
 */

export const GCAL_TIMEZONE = 'Europe/Rome';

/** The public Google calendar the deploy keeps in sync (GCAL_CALENDAR_ID in CI). */
export const GCAL_PUBLIC_CALENDAR = 'vtesitaly@gmail.com';

/** "Add this calendar" on Google: `cid` is the calendar id in base64, unpadded. */
export const GCAL_SUBSCRIBE_GOOGLE =
  'https://calendar.google.com/calendar/u/0?cid=' + btoa(GCAL_PUBLIC_CALENDAR).replace(/=+$/, '');

/** Google's public iCal feed of the same calendar, for Apple Calendar and Outlook. */
export const GCAL_SUBSCRIBE_ICAL = `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(GCAL_PUBLIC_CALENDAR)}/public/basic.ics`;

/** Single-day events with a start time but no end: Google needs one. */
const DEFAULT_HOURS = 6;

export type GcalTime = { date: string } | { dateTime: string; timeZone: string };

/** The fields of a site calendar event (CalendarEvent) that Google needs. */
export interface GcalSource {
  date: string;
  endDate?: string;
  time?: string;
  title: string;
  url?: string;
  venue?: string;
  location?: string;
  format?: string;
  description?: string;
  archonUrl?: string;
  platform?: string;
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

/** Start and end on Google. Multi-day events and days without a start time
 *  are all-day, with Google's exclusive end date (hence the extra day). */
export function eventTiming(ev: GcalSource): { start: GcalTime; end: GcalTime } {
  const t = parseTime(ev.time ?? '');
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
export function eventPlace(ev: GcalSource): string | undefined {
  const { venue, location } = ev;
  if (venue && location && !location.includes(venue)) return `${venue}, ${location}`;
  return location || venue || undefined;
}

/** The site title without the "Starts:" prefix of a multi-day start cell. */
export function eventSummary(ev: GcalSource, startsPrefix: string): string {
  const prefix = `${startsPrefix}: `;
  return ev.endDate && ev.title.startsWith(prefix) ? ev.title.slice(prefix.length) : ev.title;
}

/** Absolute page URL, undefined for calendar-only (local) events. */
export function eventPageUrl(ev: GcalSource, siteUrl: string): string | undefined {
  return ev.url ? siteUrl + ev.url : undefined;
}

/** Format (or description), platform link and page link, one per line. */
export function eventDetails(ev: GcalSource, siteUrl: string): string | undefined {
  const lines = [
    ev.description ?? ev.format,
    ev.archonUrl && `${ev.platform ?? 'Archon'}: ${ev.archonUrl}`,
    eventPageUrl(ev, siteUrl),
  ];
  return lines.filter(Boolean).join('\n') || undefined;
}

/**
 * The site splits a multi-day event into a start cell and an "Ends:" cell
 * (endDate === date). For an end cell, its start cell in `events`; for any
 * other event, the event itself.
 */
export function rangeStart<T extends GcalSource>(ev: T, events: T[]): T {
  if (!ev.endDate || ev.endDate !== ev.date) return ev;
  return events.find((e) => e.url === ev.url && e.endDate === ev.endDate && e.date < ev.date) ?? ev;
}

/** "20261101T103000" / "20261101": the `dates` format of Google's template link. */
function compact(t: GcalTime): string {
  return 'date' in t ? t.date.replace(/-/g, '') : t.dateTime.replace(/[-:]/g, '');
}

/**
 * Google Calendar "add event" link for one event of the site calendar, with
 * the same timing, title, place and description as the synced event.
 */
export function googleTemplateUrl<T extends GcalSource>(
  ev: T,
  events: T[],
  opts: { siteUrl: string; startsPrefix: string },
): string {
  const src = rangeStart(ev, events);
  const { start, end } = eventTiming(src);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventSummary(src, opts.startsPrefix),
    dates: `${compact(start)}/${compact(end)}`,
    ctz: GCAL_TIMEZONE,
  });
  const details = eventDetails(src, opts.siteUrl);
  if (details) p.set('details', details);
  const place = eventPlace(src);
  if (place) p.set('location', place);
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}
