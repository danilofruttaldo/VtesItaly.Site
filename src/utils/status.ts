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
 * Resolve a tournament platform label from its URL.
 */
export function resolvePlatformLabel(url: string): string {
  if (url.includes('bcncrisis')) return 'BCN Crisis';
  if (url.includes('archon')) return 'Archon';
  if (url.includes('vtesitaly')) return 'Site';
  return url;
}
