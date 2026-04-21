/* Zod schemas for the JSON files in src/data/standings/.
 *
 * The repo has three dialects (discovered by inspecting the 22 standings JSON):
 *
 *  - **EventStanding** — gp/, nc/, ev/ single-tournament results
 *      { rank, name, gw, vp, fvp?, tp }
 *  - **TourStanding** — tour/ aggregate per-stage breakdown
 *      base + { city?, total?, away?, s1..sN? } where stage scores can be
 *      number or a per-game breakdown object
 *  - **LeagueStanding** — league/ league standings
 *      { rank, name, games, bp, lp, pp, fp? }
 *
 * The WoS file (src/data/standings/ev/standings-wos-2025.json) is a
 * top-level object instead of an array — handled separately by
 * `WosStandings.astro` and intentionally not covered by these schemas.
 */
import { z } from 'zod';

/** Stage score: tournaments record either a single number or a per-game
 *  breakdown object (eg. { gw, vp }). Pass-through to keep JSON faithful. */
const stageScoreSchema = z.union([z.number(), z.record(z.string(), z.unknown())]);

/** Base shared by every dialect. */
const baseRowSchema = z.object({
  rank: z.number().int().min(1),
  name: z.string().min(1),
});

/** Single-event tournament row (GP, NC, individual events). */
export const eventStandingRowSchema = baseRowSchema.extend({
  gw: z.number().int().min(0),
  vp: z.number().min(0),
  fvp: z.number().nullable().optional(),
  tp: z.number().int().min(0),
});

/** Tour aggregate row — only rank+name are guaranteed; everything else is
 *  optional because the tour table mixes "scored stages" (s1, s2…) with the
 *  aggregate `total` and per-row `city`. Some rows have a per-stage tournament
 *  score (vp, gw, fvp, tp), others are pure aggregates. */
export const tourStandingRowSchema = baseRowSchema.extend({
  gw: z.number().int().min(0).optional(),
  vp: z.number().min(0).optional(),
  fvp: z.number().nullable().optional(),
  tp: z.number().int().min(0).optional(),
  city: z.string().optional(),
  total: z.number().optional(),
  away: z.array(z.unknown()).optional(),
  s1: stageScoreSchema.optional(),
  s2: stageScoreSchema.optional(),
  s3: stageScoreSchema.optional(),
  s4: stageScoreSchema.optional(),
  s5: stageScoreSchema.optional(),
  s6: stageScoreSchema.optional(),
  s7: stageScoreSchema.optional(),
  s8: stageScoreSchema.optional(),
  s9: stageScoreSchema.optional(),
  s10: stageScoreSchema.optional(),
  s11: stageScoreSchema.optional(),
});

/** League season row — different point system from tournaments. */
export const leagueStandingRowSchema = baseRowSchema.extend({
  games: z.number().int().min(0),
  bp: z.number().int(),
  lp: z.number(),
  pp: z.number(),
  fp: z.number().nullable().optional(),
});

export type EventStandingRow = z.infer<typeof eventStandingRowSchema>;
export type TourStandingRow = z.infer<typeof tourStandingRowSchema>;
export type LeagueStandingRow = z.infer<typeof leagueStandingRowSchema>;

/** Pick the right row schema for a standings file based on its repo path. */
export function rowSchemaForPath(path: string): z.ZodTypeAny {
  if (path.includes('/league/')) return leagueStandingRowSchema;
  if (path.includes('/tour/')) return tourStandingRowSchema;
  // gp/, nc/, ev/ all use the single-event tournament shape
  return eventStandingRowSchema;
}

/** The WoS file is a single object, not an array — opt out by name. */
export function isStructuralEdgeCase(path: string): boolean {
  return /standings-wos-/.test(path);
}
