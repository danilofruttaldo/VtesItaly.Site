import { describe, it, expect } from 'vitest';
import { albumsIndexProblems, postAlbumSlug } from '../../src/utils/albums-index';

const album = (slug: string, photos = [{ src: '/a.webp', thumb: '/a-thumb.webp' }]) => ({
  slug,
  title: `Album ${slug}`,
  url: `https://foto.vtesitaly.com/${slug}/`,
  photos,
});

describe('albums-index: postAlbumSlug', () => {
  it('reads the album slug of the frontmatter, quoted or not', () => {
    expect(postAlbumSlug("title: 'GP'\nalbum: 'gp-2026'\n")).toBe('gp-2026');
    expect(postAlbumSlug('album: "nc-2026"')).toBe('nc-2026');
    expect(postAlbumSlug('album: wos-2025')).toBe('wos-2025');
  });

  it('returns undefined for a post without an album', () => {
    expect(postAlbumSlug("title: 'GP'\n")).toBeUndefined();
  });
});

describe('albums-index: albumsIndexProblems', () => {
  it('accepts a complete index that has every album the posts name', () => {
    const posts = [
      { name: 'gp-2026.md', text: "album: 'gp-2026'" },
      { name: 'nota.md', text: 'no album' },
    ];
    expect(albumsIndexProblems({ albums: [album('gp-2026')] }, posts)).toEqual([]);
  });

  it('rejects an index without the albums list', () => {
    expect(albumsIndexProblems({}, [])).toEqual(['manca la lista "albums"']);
    expect(albumsIndexProblems(null, [])).toEqual(['manca la lista "albums"']);
  });

  it('reports albums missing fields or photos', () => {
    const problems = albumsIndexProblems(
      {
        albums: [
          { slug: 'senza-titolo', url: 'u', photos: [{ src: 's', thumb: 't' }] },
          album('vuoto', []),
          album('foto-rotta', [{ src: '/a.webp', thumb: '' }]),
        ],
      },
      [],
    );
    expect(problems).toEqual([
      expect.stringMatching(/^album senza slug, title o url: \{"slug":"senza-titolo"/),
      'vuoto: nessuna foto',
      'foto-rotta: foto senza src o thumb',
    ]);
  });

  it('reports a post naming an album the archive lacks', () => {
    expect(albumsIndexProblems({ albums: [album('gp-2026')] }, [{ name: 'nc.md', text: 'album: nc-2026' }])).toEqual([
      `nc.md cita l'album "nc-2026", che sull'archivio non c'è`,
    ]);
  });
});
