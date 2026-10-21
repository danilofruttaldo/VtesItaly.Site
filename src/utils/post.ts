import type { CollectionEntry } from 'astro:content';
import { isoDate, lastEventDay } from './date';

/**
 * A league post: a local, multi-session campaign. Its `events[]` are the single
 * game days, which stay off the calendar and off the homepage timeline: a
 * league surfaces as one piece of news at the post date, nothing more. Same
 * predicate the page router uses to pick `LeagueEdition`.
 */
export function isLeaguePost(post: CollectionEntry<'blog'>): boolean {
  if (post.data.pageLayout === 'article') return false;
  return post.data.category === 'comunita' && (!!post.data.leagueStats || post.data.tags.includes('lega'));
}

/**
 * Last day (YYYY-MM-DD) of a post's event, its start day when single-day.
 * Derived from `events[]` (`date` and per-event `endDate`); league game days
 * do not stretch it, a league is news at its post date.
 */
export function postEndDay(post: CollectionEntry<'blog'>): string {
  const start = isoDate(new Date(post.data.date));
  return isLeaguePost(post) ? start : lastEventDay(post.data.events, start);
}
