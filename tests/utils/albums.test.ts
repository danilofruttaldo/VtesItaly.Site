import { describe, it, expect } from 'vitest';
import { albumFor, albumSections, previewPhotos, sectionLabel, type Album } from '../../src/utils/albums';

const photo = (n: number, section?: string) => ({
  src: `https://foto.vtesitaly.com/p/x/${n}.webp`,
  thumb: `https://foto.vtesitaly.com/p/x/${n}-thumb.webp`,
  width: 1600,
  height: 1067,
  ...(section ? { section } : {}),
});
const album: Album = {
  slug: 'x',
  title: 'X',
  date: '2026-01-01',
  city: 'bologna',
  url: 'https://foto.vtesitaly.com/x/',
  cover: 'https://foto.vtesitaly.com/p/x/cover-thumb.webp',
  photos: [photo(1, 'Round'), photo(2, 'Round'), photo(3, 'Finale'), photo(4)],
};

describe('albums', () => {
  it('finds an album by slug, none for a missing or empty one', () => {
    expect(albumFor('x', [album])).toBe(album);
    expect(albumFor('y', [album])).toBeUndefined();
    expect(albumFor(undefined, [album])).toBeUndefined();
  });

  it('groups consecutive photos by section, untitled ones on their own', () => {
    const sections = albumSections(album);
    expect(sections.map((s) => [s.title, s.photos.length])).toEqual([
      ['Round', 2],
      ['Finale', 1],
      [undefined, 1],
    ]);
  });

  it('names the archive sections in English on EN pages', () => {
    expect(sectionLabel('Preparazione', 'en')).toBe('Setup');
    expect(sectionLabel('Finale', 'en')).toBe('Final');
    expect(sectionLabel('Finale', 'it')).toBe('Finale');
    expect(sectionLabel('Altro', 'en')).toBe('Altro');
  });

  it('reads the archive index', () => {
    expect(albumFor('gp-2026')?.photos.length).toBeGreaterThan(0);
  });
});

describe('previewPhotos', () => {
  const many: Album = { ...album, photos: Array.from({ length: 10 }, (_, i) => photo(i + 1)) };

  it('spreads the preview across the album: first, last and evenly spaced', () => {
    expect(previewPhotos(many).map((p) => p.src.match(/(\d+)\.webp$/)?.[1])).toEqual(['1', '4', '7', '10']);
  });

  it('returns every photo of a small album', () => {
    expect(previewPhotos(album, 6)).toHaveLength(4);
  });

  it('translates the section titles the archive uses now', () => {
    expect(sectionLabel('Turni di gioco', 'en')).toBe('Rounds');
    expect(sectionLabel('Allestimento e premi', 'en')).toBe('Setup and prizes');
  });
});
