import { todayLocalIso } from './today';
import { isoDay } from './date';

interface Stage {
  date: Date;
  status?: string;
}

export type TourStatus = 'past' | 'live' | 'upcoming';
export type EventStatus = 'past' | 'live' | 'upcoming';

/** A tour stage reduced to what the status needs, as serialized for the client. */
export interface StageDay {
  date: string; // YYYY-MM-DD
  cancelled: boolean;
}

/**
 * Tour status from its stages as calendar days, against `today` (YYYY-MM-DD).
 * Shared by the build (computeTourStatus) and by the browser script
 * (src/scripts/temporal.ts), which re-runs it against the visitor's own day
 * so cached HTML does not keep the build-day status.
 */
export function tourStatusOn(stages: StageDay[], today: string): TourStatus | null {
  const active = stages.filter((s) => !s.cancelled);
  if (active.length === 0) return null;
  if (active.some((s) => s.date === today)) return 'live';
  const statuses = active.map((s) => (s.date < today ? 'completed' : 'future'));
  if (statuses.every((s) => s === 'completed')) return 'past';
  if (statuses.every((s) => s === 'future')) return 'upcoming';
  return 'live';
}

/**
 * Event status from its first and last calendar day, against `today`
 * (YYYY-MM-DD). A multi-day event (GP, NC) stays live for its whole run;
 * `endDate` defaults to `date` for single-day events.
 */
export function eventStatusOn(date: string, today: string, endDate: string = date): EventStatus {
  if (today < date) return 'upcoming';
  return today > (endDate || date) ? 'past' : 'live';
}

export type StageStatus = 'completed' | 'upcoming' | 'future' | 'cancelled';

/**
 * Per-stage status of a tour page against `today` (YYYY-MM-DD): a stage on
 * its day and the first one after it are "upcoming", hidden-date stages are
 * "future". Run at build time and again in the browser (TourEdition script),
 * where `future` also means the placeholder cover (see stageRevealDates).
 */
export function stageStatusesOn(
  stages: { date: string; cancelled: boolean; hidden: boolean }[],
  today: string,
): StageStatus[] {
  const out: StageStatus[] = stages.map((s) =>
    s.cancelled
      ? 'cancelled'
      : s.hidden
        ? 'future'
        : s.date === today
          ? 'upcoming'
          : s.date < today
            ? 'completed'
            : 'future',
  );
  const firstFuture = out.indexOf('future');
  if (firstFuture !== -1) out[firstFuture] = 'upcoming';
  return out;
}

/** Stages as `StageDay`, the shape the page hands to the browser. */
export function toStageDays(stages: Stage[]): StageDay[] {
  return stages.map((s) => ({ date: isoDay(s.date), cancelled: s.status === 'cancelled' }));
}

/**
 * Compute the overall tour status from its stages.
 * Returns null when the stages array is empty.
 */
export function computeTourStatus(stages: Stage[]): TourStatus | null {
  if (stages.length === 0) return null;
  return tourStatusOn(toStageDays(stages), todayLocalIso());
}

/**
 * Compute event status for an event (GP, NC, community events), live from its
 * first to its last day (`endDate`, YYYY-MM-DD).
 */
export function computeEventStatus(eventDate: Date, endDate?: string): EventStatus {
  return eventStatusOn(isoDay(eventDate), todayLocalIso(), endDate);
}

type DisplayStage = { date: Date; image?: string; status?: string; hideDate?: boolean };

/**
 * Day (YYYY-MM-DD) from which each stage shows its real cover instead of the
 * placeholder: '' when always, null when no date reveals it (a hidden-date
 * stage after another unrevealed one). A stage is real once its day has come,
 * or once every earlier stage has, which makes it the next one up. The build
 * uses it for the placeholder and the browser re-runs it against the visitor's
 * day (src/scripts/temporal.ts, Calendar), so cached HTML does not keep a
 * placeholder after the previous stage is over.
 */
export function stageRevealDates(stages: DisplayStage[]): (string | null)[] {
  let earlierHidden = false;
  let earlierMax = '';
  return stages.map((s) => {
    if (s.status === 'cancelled') return '';
    const asNext = earlierHidden ? null : earlierMax;
    if (s.hideDate) {
      earlierHidden = true;
      return asNext;
    }
    const own = isoDay(s.date);
    if (own > earlierMax) earlierMax = own;
    return asNext !== null && asNext < own ? asNext : own;
  });
}

/** The placeholder cover of a tour: the `000.webp` sibling of the first stage image. */
export function stagePlaceholder(stages: DisplayStage[]): string {
  return stages[0]?.image?.replace(/\d{3}\.webp$/, '000.webp') || '';
}

/**
 * Per-stage display images against `today` (YYYY-MM-DD): the placeholder for
 * stages not revealed yet (see `stageRevealDates`), the real cover otherwise.
 */
export function computeStageDisplayImages(
  stages: DisplayStage[],
  today: string = todayLocalIso(),
): (string | undefined)[] {
  const reveal = stageRevealDates(stages);
  const placeholder = stagePlaceholder(stages);
  return stages.map((s, i) => {
    if (!s.image) return undefined;
    const from = reveal[i];
    return from !== null && today >= from ? s.image : placeholder;
  });
}

/**
 * Build-time cover of a stage plus, when it is still the placeholder but a
 * later day reveals it, the real image and that day for the browser swap.
 */
export function stageDisplay(
  stages: DisplayStage[],
  today: string = todayLocalIso(),
): { image: string | undefined; revealImage?: string; revealFrom?: string }[] {
  const reveal = stageRevealDates(stages);
  const shown = computeStageDisplayImages(stages, today);
  return stages.map((s, i) => {
    const from = reveal[i];
    if (!s.image || shown[i] === s.image || from === null) return { image: shown[i] };
    return { image: shown[i], revealImage: s.image, revealFrom: from };
  });
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

/**
 * Choose the display label for a tournament link. For known platforms (Archon,
 * BCN Crisis) the platform name is always shown so the chip is recognizable at
 * a glance: an editorial label, when present, is kept as a prefix
 * (`{label} - {platform}`, mirroring the per-event link chips); otherwise just
 * the platform name. Non-platform links use the editorial label verbatim.
 * Used by Event/Tour/League pages and standalone post link chips.
 */
export function resolveLinkLabel(l: { label: string; url: string }): string {
  if (l.url.includes('bcncrisis') || l.url.includes('archon')) {
    const platform = resolvePlatformLabel(l.url);
    return l.label ? `${l.label} - ${platform}` : platform;
  }
  return l.label;
}
