/**
 * Helpers for "today" in the user's local timezone.
 *
 * `new Date().toISOString().slice(0, 10)` returns UTC and rolls past midnight
 * 1–2 hours late in CEST, which mis-pivots the homepage timeline for users
 * between local midnight and 02:00. Use these helpers instead so the cutover
 * happens at local midnight everywhere.
 */

/** Current date as YYYY-MM-DD in the local timezone. */
export function todayLocalIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Local midnight today as a Date, for comparisons against other Date objects. */
export function todayLocalMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
