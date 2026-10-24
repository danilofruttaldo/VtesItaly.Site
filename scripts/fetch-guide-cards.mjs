/* Copies the card images of the guides into public/images/krcg/ and points the
 * guides at the local copies, so a page never depends on static.krcg.org
 * being up (and the CSP needs no third-party image origin).
 *
 * Run by hand, not in the build: `node scripts/fetch-guide-cards.mjs`. It finds
 * every card the guides in src/content/guide/ reference, either still as
 * `https://static.krcg.org/card/<name>.jpg` or already as
 * `/images/krcg/<name>.webp`, downloads the current KRCG scan, writes it as
 * WebP (358x500, the size the guides declare) and rewrites the remote links.
 * Re-running it refreshes every copy from KRCG; the WebP files are committed.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const GUIDES = 'src/content/guide';
const OUT = 'public/images/krcg';
const REMOTE = /https:\/\/static\.krcg\.org\/card\/([a-z0-9]+)\.jpg/g;
const LOCAL = /\/images\/krcg\/([a-z0-9]+)\.webp/g;

const files = readdirSync(GUIDES).filter((f) => f.endsWith('.md'));
const names = new Set();
for (const f of files) {
  const text = readFileSync(join(GUIDES, f), 'utf8');
  for (const m of text.matchAll(REMOTE)) names.add(m[1]);
  for (const m of text.matchAll(LOCAL)) names.add(m[1]);
}

mkdirSync(OUT, { recursive: true });
let bytes = 0;
for (const name of [...names].sort()) {
  const res = await fetch(`https://static.krcg.org/card/${name}.jpg`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) {
    console.error(`guide-cards: ${name}.jpg returned HTTP ${res.status}`);
    process.exit(1);
  }
  const webp = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(358, 500, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();
  writeFileSync(join(OUT, `${name}.webp`), webp);
  bytes += webp.length;
}

let rewritten = 0;
for (const f of files) {
  const path = join(GUIDES, f);
  const text = readFileSync(path, 'utf8');
  const next = text.replace(REMOTE, (_, name) => `/images/krcg/${name}.webp`);
  if (next !== text) {
    writeFileSync(path, next);
    rewritten++;
  }
}

console.log(
  `guide-cards: ${names.size} cards in ${OUT} (${Math.round(bytes / 1024)} KB), ${rewritten} guides rewritten`,
);
