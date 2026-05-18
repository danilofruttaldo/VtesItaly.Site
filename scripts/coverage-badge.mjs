/* Reads `coverage/coverage-summary.json` (emitted by vitest's
 * `json-summary` reporter) and writes `.github/coverage-badge.json` in the
 * shields.io endpoint schema so the README badge auto-refreshes whenever
 * coverage changes. Picks the `lines` total because it's the metric the
 * vitest threshold gates on and is the most-cited public number.
 *
 * Colour banding mirrors shields.io's own convention:
 *   ≥90 brightgreen | ≥80 green | ≥70 yellowgreen | ≥60 yellow | else red
 *
 * The CI step that calls this script must commit the resulting file with
 * `[skip ci]` to avoid a feedback loop.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const summary = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
const pct = summary.total.lines.pct;
const rounded = Math.round(pct * 10) / 10;

function colour(p) {
  if (p >= 90) return 'brightgreen';
  if (p >= 80) return 'green';
  if (p >= 70) return 'yellowgreen';
  if (p >= 60) return 'yellow';
  return 'red';
}

const badge = {
  schemaVersion: 1,
  label: 'coverage',
  message: `${rounded}%`,
  color: colour(pct),
};

writeFileSync('.github/coverage-badge.json', JSON.stringify(badge, null, 2) + '\n');
console.log(`coverage badge: ${badge.message} (${badge.color})`);
