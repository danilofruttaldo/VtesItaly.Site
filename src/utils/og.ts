import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

/**
 * Share-preview image (og:image) with its real size and type.
 *
 * The cards in public/images/og/ are JPEG at 1200x630: WhatsApp and Facebook
 * read JPEG everywhere, while WebP is still skipped by some previewers. Post
 * pages share their poster instead, whatever its size: the dimensions are read
 * from the file so the services can reserve the right box before downloading
 * it. A path that is not in public/ gets only its type.
 */
export interface OgImage {
  url: string;
  type?: string;
  width?: number;
  height?: number;
}

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

/** MIME type from the file extension, or undefined for unknown ones. */
export function ogImageType(src: string): string | undefined {
  const ext = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(src)?.[1]?.toLowerCase();
  return ext ? TYPES[ext] : undefined;
}

/** The OG card of a principato: its header image renamed into public/images/og/. */
export function cityOgImage(headerImage: string): string {
  return headerImage.replace('/headers/header-', '/og/og-').replace(/\.webp$/, '.jpg');
}

const sizes = new Map<string, Promise<{ width?: number; height?: number }>>();

async function readSize(file: string): Promise<{ width?: number; height?: number }> {
  try {
    const meta = await sharp(file).metadata();
    return { width: meta.width, height: meta.height };
  } catch {
    return {};
  }
}

/** Absolute URL, type and, for files in public/, the pixel size. */
export async function ogImage(src: string, site: URL, publicDir = join(process.cwd(), 'public')): Promise<OgImage> {
  const url = new URL(src, site).href;
  const type = ogImageType(src);
  const file = src.startsWith('/') ? join(publicDir, decodeURI(src.split(/[?#]/)[0])) : '';
  if (!file || !existsSync(file)) return { url, type };
  if (!sizes.has(file)) sizes.set(file, readSize(file));
  return { url, type, ...(await sizes.get(file)) };
}
