/* Generates `<name>-thumb.webp` siblings (240x240) for every `<name>.webp`
 * under the *allowed* image roots, currently `public/images/comunita/`
 * (PostCard 80–120 px slot), `public/images/principi/` (prince avatars at
 * 120 px) and `public/images/headers/` (city headers, the card image of most
 * community tournaments), plus every poster, featured or stage image a post
 * names under `public/{tour,nc,gp,ev}/`: the tournament covers on the home and
 * principato cards. Without these, Lighthouse calls out
 * `uses-responsive-images` because the full posters download as the card thumb
 * (~290 KB → ~12 KB after this).
 *
 * The square is cut around each image's point of interest (sharp's attention
 * strategy: the most salient region), not a fixed edge: a wide header keeps
 * its tower, a wide banner its logo. The same point, as a CSS
 * `object-position`, goes into src/data/image-focus.json for the places that
 * crop the full image in CSS (Tour stage cards, calendar popup). When the
 * automatic choice is wrong, FOCUS_OVERRIDES pins it by hand. Portrait images
 * (posters) are cut from the top, where the title is.
 *
 * Allow-list intentionally narrow: card art (`carte/`), twin photos
 * (`gemelli/`), the site logo and OG covers render at sizes
 * >= 400 px or never in a card.
 *
 * Re-run is idempotent: a thumb is regenerated only when the source is newer
 * (mtime check) or its point of interest moved, and the focus file is written
 * only when it changes.
 */
import sharp from 'sharp';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['public/images/comunita', 'public/images/principi', 'public/images/headers'];
const FOCUS_FILE = 'src/data/image-focus.json';

/**
 * Hand-picked points of interest, as fractions of the free space (0 = left/top,
 * 1 = right/bottom). After removing one, run with `--force`: an up-to-date thumb
 * keeps its last point otherwise.
 */
const FOCUS_OVERRIDES = {
  // The lion statue on the right, not the wall in the middle.
  '/images/headers/header-massa.webp': [0.78, 0.5],
  // Wide banners with the title on the right half.
  '/images/comunita/trento/concilio-di-pergine-2026.webp': [0.85, 0.5],
  '/images/comunita/trento/concilio-di-pergine.webp': [0.8, 0.5],
};

// `--force` recomputes every point and thumb, after a change to the rules below.
const FORCE = process.argv.includes('--force');

// Card images named in the posts' frontmatter (poster, featuredImage, stage
// `image`) that live outside the roots above.
const BLOG = 'src/content/blog';
const NAMED = new Set();
for (const f of readdirSync(BLOG)) {
  if (!f.endsWith('.md')) continue;
  const text = readFileSync(join(BLOG, f), 'utf8');
  for (const m of text.matchAll(/^\s*(?:poster|featuredImage|image):\s*['"]?(\/(?:tour|nc|gp|ev)\/[^'"\s]+\.webp)/gm)) {
    NAMED.add(join('public', m[1]));
    // A tour stage also needs its placeholder cover (`…-000.webp`) as a thumb.
    if (m[1].startsWith('/tour/')) NAMED.add(join('public', m[1].replace(/\d{3}\.webp$/, '000.webp')));
  }
}

const THUMB_SIZE = 240;
const previous = existsSync(FOCUS_FILE) ? JSON.parse(readFileSync(FOCUS_FILE, 'utf8')) : {};
const focus = {};

let generated = 0;
let skipped = 0;

async function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(p);
      continue;
    }
    if (!/\.webp$/i.test(entry.name)) continue;
    if (/-thumb\.webp$/i.test(entry.name)) continue;
    if (/-2x\.webp$/i.test(entry.name)) continue;
    // Responsive width variants from build-poster-variants.mjs are already
    // downscaled display images: don't thumbnail them.
    if (/-\d+w\.webp$/i.test(entry.name)) continue;
    await makeThumb(p);
  }
}

/**
 * The image scaled so its short side is the thumb size (raw pixels: the thumb
 * is encoded once, at the end) and where the square sits in it. With
 * `fit: 'outside'` only one side has room to move.
 */
async function square(p, key) {
  const { data, info } = await sharp(p)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'outside' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
  const freeX = info.width - THUMB_SIZE;
  const freeY = info.height - THUMB_SIZE;
  let fx = 0.5;
  let fy = 0.5;
  if (FOCUS_OVERRIDES[key]) {
    [fx, fy] = FOCUS_OVERRIDES[key];
  } else if (freeY > 0) {
    // Portrait (posters): the title is at the top, and salience tends to pick
    // the dense small print at the bottom instead.
    fy = 0;
  } else if (freeX > 0) {
    const { info: crop } = await sharp(data, raw)
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: sharp.strategy.attention })
      .raw()
      .toBuffer({ resolveWithObject: true });
    fx = -crop.cropOffsetLeft / freeX;
  }
  return { data, raw, left: Math.round(fx * freeX), top: Math.round(fy * freeY), fx, fy };
}

/** True when the thumb exists and is newer than its source. */
function thumbFresh(p, thumb) {
  try {
    return statSync(thumb).mtimeMs >= statSync(p).mtimeMs;
  } catch {
    return false;
  }
}

async function makeThumb(p) {
  const key = '/' + relative('public', p).replace(/\\/g, '/');
  const thumb = p.replace(/\.webp$/i, '-thumb.webp');
  const fresh = !FORCE && thumbFresh(p, thumb);
  // Up-to-date thumb with a known point and no hand override: nothing to recompute.
  if (fresh && previous[key] && !FOCUS_OVERRIDES[key]) {
    focus[key] = previous[key];
    skipped++;
    return;
  }
  const sq = await square(p, key);
  const position = `${Math.round(sq.fx * 100)}% ${Math.round(sq.fy * 100)}%`;
  focus[key] = position;
  if (fresh && previous[key] === position) {
    skipped++;
    return;
  }
  await sharp(sq.data, sq.raw)
    .extract({ left: sq.left, top: sq.top, width: THUMB_SIZE, height: THUMB_SIZE })
    .webp({ quality: 78, effort: 6 })
    .toFile(thumb);
  generated++;
}

for (const root of ROOTS) await walk(root);
for (const p of NAMED) {
  try {
    statSync(p);
  } catch {
    continue; // a missing image is the link checker's to report
  }
  await makeThumb(p);
}

const sorted = Object.fromEntries(Object.entries(focus).sort(([a], [b]) => a.localeCompare(b)));
const json = JSON.stringify(sorted, null, 2) + '\n';
if (!existsSync(FOCUS_FILE) || readFileSync(FOCUS_FILE, 'utf8') !== json) writeFileSync(FOCUS_FILE, json);
console.log(`thumbnails: ${generated} generated, ${skipped} up to date`);
