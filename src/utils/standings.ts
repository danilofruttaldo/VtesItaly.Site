import { anonymizeName } from './anonymize';
import type { Locale } from './i18n';
import { formatLocalDate } from './i18n';

export interface Standing {
  rank: number;
  name: string;
  gw: number;
  vp: number;
  fvp: number | null;
  tp: number;
}

/** Every standings table under src/data/standings, by module path. */
const STANDINGS_FILES = import.meta.glob('/src/data/standings/**/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>;

/**
 * Module key of the standings file a frontmatter `standingsUrl` names. The
 * value may be absolute, relative or without `.json`: only its file name
 * counts, matched exactly (file names are unique across the folders).
 */
export function findStandingsKey(keys: string[], url: string): string | undefined {
  const file = url.replace(/^.*\//, '').replace(/(\.json)?$/, '.json');
  return keys.find((k) => k.endsWith(`/${file}`));
}

/** Rows of the standings file a `standingsUrl` names; empty when unresolved. */
export function loadStandings<T = Standing>(
  url: string | undefined,
  files: Record<string, { default: unknown }> = STANDINGS_FILES,
): T[] {
  if (!url) return [];
  const key = findStandingsKey(Object.keys(files), url);
  const rows = key ? files[key].default : undefined;
  return Array.isArray(rows) ? (rows as T[]) : [];
}

/**
 * The standings file behind an edition's archive card: the post-level one, else
 * the main event's (multi-tournament weekends keep theirs on `events[]`), else
 * the first event that has one.
 */
function cardStandingsUrl(data: {
  standingsUrl?: string;
  events?: { name?: string; standingsUrl?: string }[];
}): string | undefined {
  if (data.standingsUrl) return data.standingsUrl;
  const withStandings = (data.events ?? []).filter((e) => e.standingsUrl);
  const main = withStandings.find((e) => /^main event:/i.test(e.name ?? ''));
  return (main ?? withStandings[0])?.standingsUrl;
}

/** Extracts archive card metadata (winner, player count) from a post's standings data. */
export function getCardMeta(
  post: { data: { events?: { date: Date; name?: string; standingsUrl?: string }[]; standingsUrl?: string } },
  allStandings: Record<string, { default: Standing[] }>,
  locale: Locale = 'it',
): { eventDate: string; winner: string; players: number } {
  const rawDate = post.data.events?.[0]?.date;
  const eventDate = rawDate instanceof Date ? formatLocalDate(rawDate, locale) : rawDate || '';
  let winner = '';
  let players = 0;
  const data = loadStandings(cardStandingsUrl(post.data), allStandings);
  if (data.length > 0) {
    players = data.length;
    const first = data.find((s) => s.rank === 1);
    if (first) winner = anonymizeName(first.name);
  }
  return { eventDate, winner, players };
}
