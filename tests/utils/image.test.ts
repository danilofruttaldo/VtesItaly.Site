import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { webpSize, responsiveImage, POSTER_WIDTHS } from '../../src/utils/image';

// Real committed fixtures with known dimensions and WebP variants.
const VP8_POSTER = '/images/comunita/barga/symposium-italicum-2026.webp'; // simple lossy, 1320x1320
const VP8X_POSTER = '/images/comunita/massa/by-night.webp'; // extended, 1200x1366

// Temp fixture dir under public/ so responsiveImage() (which resolves against
// `public`) can see a poster with and without generated `-<w>w.webp` siblings,
// covering the srcset branch without depending on the git-ignored build output.
const DIR = 'public/__img_test__';
const ORIG = `/__img_test__/orig.webp`;
const SOLO = `/__img_test__/solo.webp`;

beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
  const real = resolve('public', VP8_POSTER.replace(/^\//, ''));
  copyFileSync(real, resolve(DIR, 'orig.webp'));
  copyFileSync(real, resolve(DIR, 'orig-400w.webp'));
  copyFileSync(real, resolve(DIR, 'orig-800w.webp'));
  copyFileSync(real, resolve(DIR, 'solo.webp')); // no variants alongside
});

afterAll(() => {
  rmSync(DIR, { recursive: true, force: true });
});

describe('image: webpSize', () => {
  it('reads dimensions from a simple-lossy (VP8 ) WebP', () => {
    expect(webpSize(VP8_POSTER)).toEqual({ width: 1320, height: 1320 });
  });

  it('reads dimensions from an extended (VP8X) WebP', () => {
    expect(webpSize(VP8X_POSTER)).toEqual({ width: 1200, height: 1366 });
  });

  it('returns undefined for a non-WebP path', () => {
    expect(webpSize('/images/logo-144.png')).toBeUndefined();
  });

  it('returns undefined for an undefined input', () => {
    expect(webpSize(undefined)).toBeUndefined();
  });

  it('returns undefined for a missing file', () => {
    expect(webpSize('/images/does-not-exist.webp')).toBeUndefined();
  });
});

describe('image: responsiveImage', () => {
  it('passes a non-WebP path through with no srcset', () => {
    const r = responsiveImage('/images/logo-144.png');
    expect(r).toEqual({ src: '/images/logo-144.png', srcset: undefined, width: undefined, height: undefined });
  });

  it('omits srcset when no variants exist, but still reports dimensions', () => {
    const r = responsiveImage(SOLO);
    expect(r.srcset).toBeUndefined();
    expect(r).toMatchObject({ src: SOLO, width: 1320, height: 1320 });
  });

  it('builds a srcset from existing variants plus the source as the largest candidate', () => {
    const r = responsiveImage(ORIG);
    expect(r.srcset).toBe(`/__img_test__/orig-400w.webp 400w, /__img_test__/orig-800w.webp 800w, ${ORIG} 1320w`);
    expect(r).toMatchObject({ width: 1320, height: 1320 });
  });

  it('never upscales: a width >= the source width is skipped', () => {
    // 9999 > 1320 → skipped; only the existing 400w variant is emitted.
    const r = responsiveImage(ORIG, [400, 9999]);
    expect(r.srcset).toBe(`/__img_test__/orig-400w.webp 400w, ${ORIG} 1320w`);
  });

  it('exposes the width ladder used by the build script', () => {
    expect(POSTER_WIDTHS).toEqual([400, 800, 1200]);
  });
});
