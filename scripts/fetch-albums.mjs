/* Reads the photo archive index (https://foto.vtesitaly.com/albums.json, repo
 * VtesItaly.Foto) that the event galleries are built from.
 *
 * Two copies, so a build never dirties the repo and never depends on the
 * network to succeed:
 * - src/data/albums.json, committed: the snapshot tests and `astro check` use,
 *   and the fallback when the archive is unreachable. Refreshed only on
 *   purpose, with `npm run albums` (this script with --snapshot).
 * - src/data/albums.live.json, git-ignored: written by every build (prebuild),
 *   so a deploy shows the photos added since the last snapshot.
 *
 * The index is checked before it is used: every album must have the fields
 * the pages read, and every `album:` a post names must be in it. A broken or
 * incomplete index stops the build instead of dropping galleries silently.
 * The checks live in src/utils/albums-index.ts, where they are unit-tested.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { albumsIndexProblems } from '../src/utils/albums-index.ts';

const URL_ALBUMS = 'https://foto.vtesitaly.com/albums.json';
const SNAPSHOT = 'src/data/albums.json';
const LIVE = 'src/data/albums.live.json';
const BLOG = 'src/content/blog';
const snapshot = process.argv.includes('--snapshot');

let data;
try {
  const res = await fetch(URL_ALBUMS, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  data = await res.json();
} catch (err) {
  if (snapshot) {
    console.error(`albums: foto.vtesitaly.com non raggiungibile (${err.message})`);
    process.exit(1);
  }
  console.warn(`albums: foto.vtesitaly.com non raggiungibile (${err.message}), uso ${SNAPSHOT}`);
  process.exit(0);
}

const posts = readdirSync(BLOG).map((name) => ({ name, text: readFileSync(join(BLOG, name), 'utf8') }));
const problems = albumsIndexProblems(data, posts);
if (problems.length) {
  console.error('albums: indice di foto.vtesitaly.com non valido:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const json = JSON.stringify(data, null, 2) + '\n';
writeFileSync(snapshot ? SNAPSHOT : LIVE, json);
console.log(`albums: ${data.albums.length} album da foto.vtesitaly.com${snapshot ? ` (copia in ${SNAPSHOT})` : ''}`);
