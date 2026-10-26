import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import snapshot from '../data/albums.json';
import type { Locale } from './i18n';

/** One photo of an album of foto.vtesitaly.com (its /albums.json). */
export interface AlbumPhoto {
  src: string;
  /** 640x640 square, cut around the photo's point of interest. */
  thumb: string;
  width: number;
  height: number;
  caption?: string;
  section?: string;
}

export interface Album {
  slug: string;
  title: string;
  date: string;
  city: string;
  url: string;
  event?: string;
  cover: string;
  photos: AlbumPhoto[];
}

/**
 * The archive index: the copy the build just fetched (src/data/albums.live.json,
 * see scripts/fetch-albums.mjs) when there is one, else the committed snapshot.
 */
function loadAlbums(): Album[] {
  const live = resolve('src/data/albums.live.json');
  const data = existsSync(live) ? JSON.parse(readFileSync(live, 'utf8')) : snapshot;
  return (data as { albums: Album[] }).albums;
}

let albums: Album[] | undefined;

/** The album a post names in `album`. */
export function albumFor(slug: string | undefined, list?: Album[]): Album | undefined {
  if (!slug) return undefined;
  return (list ?? (albums ??= loadAlbums())).find((a) => a.slug === slug);
}

/** Consecutive photos of the same section, as the archive groups them. */
export function albumSections(album: Album): { title?: string; photos: AlbumPhoto[] }[] {
  const out: { title?: string; photos: AlbumPhoto[] }[] = [];
  for (const photo of album.photos) {
    const last = out[out.length - 1];
    if (last && last.title === photo.section) last.photos.push(photo);
    else out.push({ title: photo.section, photos: [photo] });
  }
  return out;
}

/** A few photos spread across an album, for a preview: the first, the last
 * and evenly spaced ones in between. */
export function previewPhotos(album: Album, count = 4): AlbumPhoto[] {
  const n = album.photos.length;
  if (n <= count) return album.photos;
  return Array.from({ length: count }, (_, i) => album.photos[Math.round((i * (n - 1)) / (count - 1))]);
}

/** English names of the section titles the archive uses (they are written in Italian). */
const SECTION_EN: Record<string, string> = {
  Preparazione: 'Setup',
  Round: 'Rounds',
  Finale: 'Final',
  Premi: 'Prizes',
  Premiazione: 'Awards',
  Bonus: 'Bonus',
  Extra: 'Extras',
  'A tavola': 'At the table',
  Accoglienza: 'Registration',
  'Allestimento e premi': 'Setup and prizes',
  'Allestimento e staff': 'Setup and staff',
  Atmosfera: 'Atmosphere',
  Cene: 'Dinners',
  'Concorso di stile': 'Style contest',
  'Finale e premiazione': 'Final and awards',
  'Finalisti e vincitore': 'Finalists and winner',
  Giudici: 'Judges',
  "Il gadget dell'evento": 'The event gadget',
  'Intorno ai tavoli': 'Around the tables',
  'Intorno al torneo': 'Around the tournament',
  'Le carte delle sanzioni': 'The penalty cards',
  'Main event': 'Main event',
  'Pausa pranzo': 'Lunch break',
  'Premi e gadget': 'Prizes and gadgets',
  'Premi in palio': 'Prizes',
  Serata: 'Evening',
  'Tavolo finale': 'Final table',
  'Trofeo e vincitore': 'Trophy and winner',
  'Turni di gioco': 'Rounds',
};

/** A section title in the page's language; unknown titles stay as written. */
export function sectionLabel(title: string, locale: Locale): string {
  return locale === 'en' ? (SECTION_EN[title] ?? title) : title;
}
