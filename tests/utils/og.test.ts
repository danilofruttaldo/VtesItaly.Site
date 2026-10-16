import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { cityOgImage, ogImage, ogImageType, ogVariant } from '../../src/utils/og';

const site = new URL('https://vtesitaly.com');

describe('og: ogImageType', () => {
  it('maps common extensions to their MIME type', () => {
    expect(ogImageType('/images/og/og-home.jpg')).toBe('image/jpeg');
    expect(ogImageType('/x/poster.WEBP')).toBe('image/webp');
    expect(ogImageType('/x/a.png?v=2')).toBe('image/png');
  });

  it('returns undefined for unknown or missing extensions', () => {
    expect(ogImageType('/x/file')).toBeUndefined();
    expect(ogImageType('/x/file.bmp')).toBeUndefined();
  });
});

describe('og: cityOgImage', () => {
  it('turns a principato header into its JPEG share card', () => {
    expect(cityOgImage('/images/headers/header-treviso.webp')).toBe('/images/og/og-treviso.jpg');
  });
});

describe('og: ogImage', () => {
  it('reads the real size of the share cards in public/', async () => {
    const og = await ogImage('/images/og/og-default.jpg', site);
    expect(og).toEqual({
      url: 'https://vtesitaly.com/images/og/og-default.jpg',
      type: 'image/jpeg',
      width: 1200,
      height: 630,
    });
  });

  it('gives only url and type for a file that is not in public/', async () => {
    const og = await ogImage('/images/og/does-not-exist.jpg', site);
    expect(og).toEqual({ url: 'https://vtesitaly.com/images/og/does-not-exist.jpg', type: 'image/jpeg' });
  });

  it('keeps going without a size when the file is not an image', async () => {
    const og = await ogImage('/manifest.json', site, join(process.cwd(), 'public'));
    expect(og.url).toBe('https://vtesitaly.com/manifest.json');
    expect(og.width).toBeUndefined();
  });
});

describe('og: JPEG variant of WebP posters', () => {
  let dir: string;

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), 'og-'));
    mkdirSync(join(dir, 'gp'));
    const img = sharp({ create: { width: 1200, height: 1697, channels: 3, background: '#800000' } });
    await img
      .clone()
      .webp()
      .toFile(join(dir, 'gp', 'poster.webp'));
    await img
      .clone()
      .jpeg()
      .toFile(join(dir, 'gp', 'poster-og.jpg'));
    await img
      .clone()
      .webp()
      .toFile(join(dir, 'gp', 'solo.webp'));
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('prefers <name>-og.jpg when it exists next to the WebP', () => {
    expect(ogVariant('/gp/poster.webp', dir)).toBe('/gp/poster-og.jpg');
  });

  it('keeps the WebP when there is no variant, and leaves other paths alone', () => {
    expect(ogVariant('/gp/solo.webp', dir)).toBe('/gp/solo.webp');
    expect(ogVariant('/images/og/og-home.jpg', dir)).toBe('/images/og/og-home.jpg');
    expect(ogVariant('https://example.com/x.webp', dir)).toBe('https://example.com/x.webp');
  });

  it('gives url, type and size of the JPEG variant', async () => {
    const og = await ogImage('/gp/poster.webp', site, dir);
    expect(og).toEqual({
      url: 'https://vtesitaly.com/gp/poster-og.jpg',
      type: 'image/jpeg',
      width: 1200,
      height: 1697,
    });
  });
});
