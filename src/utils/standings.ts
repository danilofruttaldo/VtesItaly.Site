import { anonymizeName } from './anonymize';

export interface Standing {
  rank: number;
  name: string;
  gw: number;
  vp: number;
  fvp: number | null;
  tp: number;
}

/** Extracts archive card metadata (winner, player count) from a post's standings data. */
export function getCardMeta(
  post: any,
  allStandings: Record<string, { default: Standing[] }>,
): { eventDate: string; winner: string; players: number } {
  const eventDate = post.data.events?.[0]?.date || '';
  let winner = '';
  let players = 0;
  if (post.data.standingsUrl) {
    const key = Object.keys(allStandings).find(k => k.includes(post.data.standingsUrl.replace(/^.*\//, '')));
    if (key) {
      const data = allStandings[key].default;
      players = data.length;
      const first = data.find((s: Standing) => s.rank === 1);
      if (first) winner = anonymizeName(first.name);
    }
  }
  if (!players && post.data.playersCount) players = post.data.playersCount;
  return { eventDate, winner, players };
}
