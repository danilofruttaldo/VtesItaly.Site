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
