import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { cityOgImage, ogImage, ogImageType } from '../../src/utils/og';

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
