/* Pure rules of the browser runtime src/scripts/temporal.ts, which re-applies
 * on the visitor's own date what the build decided on its day. Kept here so
 * they are unit-tested; the runtime only reads and writes the DOM.
 */
import type { StageDay } from './status';

/** Modifier class of a `.post__status` badge: finished once past, else active. */
export function statusClass(status: string): 'post__status--finished' | 'post__status--active' {
  return status === 'past' ? 'post__status--finished' : 'post__status--active';
}

/** The stage days of a `data-tour-stages` attribute, or null when it is not a valid JSON array. */
export function parseStageDays(json: string | null): StageDay[] | null {
  try {
    const value: unknown = JSON.parse(json || '[]');
    return Array.isArray(value) ? (value as StageDay[]) : null;
  } catch {
    return null;
  }
}

/** A tour cover with reveal day `from` shows from that day on (no day: at once). */
export function isRevealDue(from: string | null, today: string): boolean {
  return today >= (from || '');
}

/** A sign-up link whose event ended on `expires` is hidden from the next day. */
export function isExpired(expires: string | null, today: string): boolean {
  return today > (expires || '');
}

/** Ascending order of YYYY-MM-DD strings. */
export function compareIsoDays(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The footer notice with the end of its "2018–2026" range set to `year`. */
export function copyrightYear(text: string, year: number): string {
  return text.replace(/–\d{4}/, '–' + year);
}
