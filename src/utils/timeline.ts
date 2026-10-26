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
 * Pick the items around the next upcoming (or in-progress) ones, from a list
 * sorted by date ascending:
 *   - 2 above (further future, farthest first)
 *   - the highlighted "next" or "today" items: every item starting the same
 *     day as the first upcoming one, so two events on one day share it
 *   - 2 below (recent past, most recent first)
 * Falls back to the other side when one side is short. The pivot compares
 * against the last day, so a multi-day event stays highlighted for its run.
 */
export function timelineWindow<T>(
  items: T[],
  today: string,
  span: (item: T) => Span,
): { entries: T[]; highlightIndex: number; highlightIndices: number[] } {
  if (items.length === 0) return { entries: [], highlightIndex: -1, highlightIndices: [] };

  const pivot = items.findIndex((it) => {
    const s = span(it);
    return (s.endDate || s.date) >= today;
  });
  if (pivot === -1) {
    // No upcoming: the 5 most recent past, newest at top, no highlight.
    return { entries: items.slice(-5).reverse(), highlightIndex: -1, highlightIndices: [] };
  }
  // The pivot and the items after it starting the same day.
  let groupEnd = pivot + 1;
  while (groupEnd < items.length && span(items[groupEnd]).date === span(items[pivot]).date) groupEnd++;
  const group = items.slice(pivot, groupEnd);

  const idealAbove = 2;
  const idealBelow = 2;
  let above = items.slice(groupEnd, groupEnd + idealAbove);
  let below = items.slice(Math.max(0, pivot - idealBelow), pivot);
  const aboveShort = idealAbove - above.length;
  const belowShort = idealBelow - below.length;
  if (aboveShort > 0) below = items.slice(Math.max(0, pivot - idealBelow - aboveShort), pivot);
  if (belowShort > 0) above = items.slice(groupEnd, groupEnd + idealAbove + belowShort);

  return {
    entries: [...above.slice().reverse(), ...group.slice().reverse(), ...below.slice().reverse()],
    highlightIndex: above.length,
    highlightIndices: group.map((_, i) => above.length + i),
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
 * Every "next event" of a list sorted future first, then past: the item
 * nextEventIndex picks and the ones just above it starting the same day,
 * so two events on one day are both highlighted. Empty when all are past.
 */
export function nextEventIndices<T>(items: T[], today: string, span: (item: T) => Span): number[] {
  const idx = nextEventIndex(items, today, span);
  if (idx === -1) return [];
  const out = [idx];
  for (let i = idx - 1; i >= 0 && span(items[i]).date === span(items[idx]).date; i--) out.unshift(i);
  return out;
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
