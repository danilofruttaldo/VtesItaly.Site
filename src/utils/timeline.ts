/**
 * Pure date rules shared by the build and the browser runtime
 * (src/scripts/temporal.ts): the same function decides at build time and
 * again against the visitor's day, so the two cannot drift apart. No imports,
 * so the browser bundle stays small.
 */

/** Start day and, for a multi-day event, last day (YYYY-MM-DD). */
export interface Span {
  date: string;
  endDate?: string;
}

/**
 * Pick 5 items centered on the next upcoming (or in-progress) one, from a
 * list sorted by date ascending:
 *   - 2 above (further future, farthest first)
 *   - 1 highlighted (the "next" or "today" item)
 *   - 2 below (recent past, most recent first)
 * Falls back to the other side when one side is short. The pivot compares
 * against the last day, so a multi-day event stays highlighted for its run.
 */
export function timelineWindow<T>(
  items: T[],
  today: string,
  span: (item: T) => Span,
): { entries: T[]; highlightIndex: number } {
  if (items.length === 0) return { entries: [], highlightIndex: -1 };

  const pivot = items.findIndex((it) => {
    const s = span(it);
    return (s.endDate || s.date) >= today;
  });
  if (pivot === -1) {
    // No upcoming: the 5 most recent past, newest at top, no highlight.
    return { entries: items.slice(-5).reverse(), highlightIndex: -1 };
  }

  const idealAbove = 2;
  const idealBelow = 2;
  let above = items.slice(pivot + 1, pivot + 1 + idealAbove);
  let below = items.slice(Math.max(0, pivot - idealBelow), pivot);
  const aboveShort = idealAbove - above.length;
  const belowShort = idealBelow - below.length;
  if (aboveShort > 0) below = items.slice(Math.max(0, pivot - idealBelow - aboveShort), pivot);
  if (belowShort > 0) above = items.slice(pivot + 1, pivot + 1 + idealAbove + belowShort);

  return {
    entries: [...above.slice().reverse(), items[pivot], ...below.slice().reverse()],
    highlightIndex: above.length,
  };
}

/**
 * Index of the first item already over, in a list sorted newest first;
 * -1 when none is. An item is over the day after its last day.
 */
export function firstPastIndex<T>(items: T[], today: string, span: (item: T) => Span): number {
  return items.findIndex((it) => {
    const s = span(it);
    return (s.endDate || s.date) < today;
  });
}

/**
 * The "next event" of a list sorted future first, then past: the last future
 * item; the last item when all are future; -1 when all are past.
 */
export function nextEventIndex<T>(items: T[], today: string, span: (item: T) => Span): number {
  const firstPast = firstPastIndex(items, today, span);
  return firstPast === -1 ? items.length - 1 : firstPast - 1;
}

/**
 * Which price column is active: early through its deadline day, then
 * regular, none once the event's last day is over.
 */
export function priceColumns(
  today: string,
  lastEventDay: string,
  earlyDeadline?: string,
): { earlyActive: boolean; regularActive: boolean } {
  const finished = today > lastEventDay;
  const earlyActive = !finished && (!earlyDeadline || today <= earlyDeadline);
  return { earlyActive, regularActive: !finished && !earlyActive };
}
