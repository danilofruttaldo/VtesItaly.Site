interface Stage {
  date: Date;
  status?: string;
}

export type TourStatus = 'past' | 'live' | 'upcoming';
export type EventStatus = 'past' | 'live' | 'upcoming';

/**
 * Compute the overall tour status from its stages.
 * Returns null when the stages array is empty.
 */
export function computeTourStatus(stages: Stage[]): TourStatus | null {
  if (stages.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const statuses = stages.map((s) => {
    if (s.status === 'cancelled') return 'cancelled';
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    return d < today ? 'completed' : 'future';
  });

  const active = statuses.filter((s) => s !== 'cancelled');
  if (active.length === 0) return null;
  if (active.every((s) => s === 'completed')) return 'past';
  if (active.every((s) => s === 'future')) return 'upcoming';
  return 'live';
}

/**
 * Compute event status for a single-date event (GP, NC, community events).
 */
export function computeEventStatus(eventDate: Date): EventStatus {
  const now = new Date();
  const isToday = eventDate.toDateString() === now.toDateString();
  if (isToday) return 'live';
  return eventDate > now ? 'upcoming' : 'past';
}

/**
 * Compute per-stage display images: future stages get the placeholder,
 * completed and upcoming stages show their real cover.
 */
export function computeStageDisplayImages(
  stages: { date: Date; image?: string; status?: string }[],
): (string | undefined)[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const statuses = stages.map((s) => {
    if (s.status === 'cancelled') return 'cancelled';
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return 'upcoming';
    return d < today ? 'completed' : 'future';
  });

  const firstFuture = statuses.indexOf('future');
  if (firstFuture !== -1) statuses[firstFuture] = 'upcoming';

  const placeholder = stages[0]?.image?.replace(/\d{3}\.webp$/, '000.webp') || '';

  return stages.map((s, i) => (!s.image ? undefined : statuses[i] === 'future' ? placeholder : s.image));
}

/**
 * Resolve a tournament platform label from its URL.
 */
export function resolvePlatformLabel(url: string): string {
  if (url.includes('bcncrisis')) return 'BCN Crisis';
  if (url.includes('archon')) return 'Archon';
  if (url.includes('vtesitaly')) return 'Site';
  return url;
}
