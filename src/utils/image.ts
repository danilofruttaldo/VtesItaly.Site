import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** Resolve the small-thumbnail variant for a `<name>.webp` image when one
 *  exists in `public/`. Used by components rendering at ≤120 px (PostCard,
 *  CityCard, prince avatars) so the full 1024² poster isn't shipped for an
 *  80² slot. Falls back to the original when no thumb has been generated yet
 *  — silent fallback prevents broken images during dev iteration before
 *  `scripts/build-thumbnails.mjs` has run for a newly added file. */
export function thumbFor(image: string | undefined): string | undefined {
  if (!image || !/\.webp$/i.test(image)) return image;
  const thumbRel = image.replace(/\.webp$/i, '-thumb.webp');
  if (existsSync(resolve('public', thumbRel.replace(/^\//, '')))) return thumbRel;
  return image;
}
