/**
 * Calendar day (YYYY-MM-DD) of a frontmatter date.
 *
 * Zod reads `date: 2026-05-18` as midnight UTC, so the UTC fields give back
 * the day exactly as written, whatever the timezone of the machine that runs
 * the build. Local getters would shift it to the previous day west of
 * Greenwich. For "today" in the visitor's timezone use `todayLocalIso()` from
 * ./today instead: that one is local on purpose.
 */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** `isoDate` for values that may already be a YYYY-MM-DD string. */
export function isoDay(d: Date | string): string {
  return d instanceof Date ? isoDate(d) : d;
}

/**
 * First calendar day (YYYY-MM-DD) of a post's events, never later than
 * `start` (the post date): a Friday side event opens a Saturday-dated
 * weekend. League `period` rows are ignored.
 */
export function firstEventDay(events: { date?: Date | string; period?: string }[] | undefined, start: string): string {
  let first = start;
  for (const ev of events ?? []) {
    if (ev.period || !ev.date) continue;
    const d = new Date(ev.date);
    if (isNaN(d.getTime())) continue;
    const iso = isoDate(d);
    if (!first || iso < first) first = iso;
  }
  return first;
}

/**
 * Last calendar day (YYYY-MM-DD) of a post's events, never earlier than
 * `start`. League `period` rows carry no real date and are ignored. Shared by
 * the status badges, the timeline cards and the structured data.
 */
export function lastEventDay(
  events: { date?: Date | string; endDate?: Date | string; period?: string }[] | undefined,
  start: string,
): string {
  let last = start;
  for (const ev of events ?? []) {
    if (ev.period) continue;
    for (const cand of [ev.date, ev.endDate]) {
      if (!cand) continue;
      const d = new Date(cand);
      if (isNaN(d.getTime())) continue;
      const iso = isoDate(d);
      if (iso > last) last = iso;
    }
  }
  return last;
}
