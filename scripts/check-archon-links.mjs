/* Dead Archon links in the content.
 *
 * archon.vekn.net is a single-page app and answers 200 for any
 * /tournaments/<uid> or /leagues/<uid>, so lychee cannot see a dead one. This
 * script collects those links from src/content and src/data, downloads the
 * public snapshot (gzip NDJSON, every tournament and league that exists) and
 * fails listing the uids that are not in it.
 *
 * Run weekly by .github/workflows/links.yml, never by the deploy CI: an Archon
 * outage must not block a deploy.
 *
 * Usage: node scripts/check-archon-links.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { extractArchonRefs, findDeadArchonRefs, parseArchonSnapshot } from '../src/utils/archon-links.ts';

const ROOTS = ['src/content', 'src/data'];
const TEXT_EXT = /\.(md|mdx|ts|json|ya?ml)$/;
const SNAPSHOT_URL = 'https://archon.vekn.net/snapshot';

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (TEXT_EXT.test(entry.name)) yield path;
  }
}

const refsByFile = new Map();
let total = 0;
for (const root of ROOTS) {
  for (const path of walk(root)) {
    const refs = extractArchonRefs(readFileSync(path, 'utf8'));
    if (refs.length === 0) continue;
    refsByFile.set(relative('.', path).split(sep).join('/'), refs);
    total += refs.length;
  }
}

const res = await fetch(SNAPSHOT_URL, { signal: AbortSignal.timeout(120_000) });
if (!res.ok) {
  console.error(`${SNAPSHOT_URL}: HTTP ${res.status}`);
  process.exit(2);
}
// fetch() undoes Content-Encoding: gzip; a body still in gzip form (served
// as a plain file) is unpacked here.
const body = Buffer.from(await res.arrayBuffer());
const text = (body[0] === 0x1f && body[1] === 0x8b ? gunzipSync(body) : body).toString('utf8');
const snapshot = parseArchonSnapshot(text);

const dead = findDeadArchonRefs(refsByFile, snapshot);
console.log(
  `${total} Archon links in ${refsByFile.size} files; snapshot: ${snapshot.tournament.size} tournaments, ${snapshot.league.size} leagues.`,
);
if (dead.length === 0) {
  console.log('No dead Archon links.');
  process.exit(0);
}
console.error(`${dead.length} dead Archon links (uid not in the snapshot):`);
for (const ref of dead) {
  console.error(`  ${ref.kind} ${ref.uid}\n    ${ref.files.join('\n    ')}`);
}
process.exit(1);
