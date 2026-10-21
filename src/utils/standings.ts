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
  const url = cardStandingsUrl(post.data);
  if (url) {
    const file = url.replace(/^.*\//, '');
    const key = Object.keys(allStandings).find((k) => k.endsWith(`/${file}`));
    if (key) {
      const data = allStandings[key].default;
      players = data.length;
      const first = data.find((s: Standing) => s.rank === 1);
      if (first) winner = anonymizeName(first.name);
    }
  }
  return { eventDate, winner, players };
}
