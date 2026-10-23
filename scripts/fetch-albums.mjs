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
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

const problems = [];
if (!Array.isArray(data?.albums)) problems.push('manca la lista "albums"');
for (const a of data?.albums ?? []) {
  if (!a.slug || !a.title || !a.url) problems.push(`album senza slug, title o url: ${JSON.stringify(a).slice(0, 80)}`);
  if (!Array.isArray(a.photos) || a.photos.length === 0) problems.push(`${a.slug}: nessuna foto`);
  else if (a.photos.some((p) => !p.src || !p.thumb)) problems.push(`${a.slug}: foto senza src o thumb`);
}
const slugs = new Set((data?.albums ?? []).map((a) => a.slug));
for (const f of readdirSync(BLOG)) {
  const m = readFileSync(join(BLOG, f), 'utf8').match(/^album:\s*['"]?([^'"\s]+)/m);
  if (m && !slugs.has(m[1])) problems.push(`${f} cita l'album "${m[1]}", che sull'archivio non c'è`);
}
if (problems.length) {
  console.error('albums: indice di foto.vtesitaly.com non valido:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const json = JSON.stringify(data, null, 2) + '\n';
writeFileSync(snapshot ? SNAPSHOT : LIVE, json);
console.log(`albums: ${data.albums.length} album da foto.vtesitaly.com${snapshot ? ` (copia in ${SNAPSHOT})` : ''}`);
