/* Checks on the photo archive index (https://foto.vtesitaly.com/albums.json)
 * before a build uses it: pure logic behind scripts/fetch-albums.mjs.
 *
 * No Astro or JSON imports: the script runs this file directly under Node.
 */

/** A blog post file, as the check reads it: its name and its raw text. */
export interface PostFile {
  name: string;
  text: string;
}

/** The `album:` slug a post's frontmatter names, if any. */
export function postAlbumSlug(text: string): string | undefined {
  return /^album:\s*['"]?([^'"\s]+)/m.exec(text)?.[1];
}

/**
 * What is wrong with an albums index, in Italian for the build log: albums
 * without the fields the pages read, albums without photos or with photos
 * missing `src`/`thumb`, and `album:` slugs of posts that the index lacks.
 * Empty when the index is usable.
 */
export function albumsIndexProblems(data: unknown, posts: PostFile[]): string[] {
  const problems: string[] = [];
  const albums = (data as { albums?: unknown } | null)?.albums;
  if (!Array.isArray(albums)) problems.push('manca la lista "albums"');
  const list = (Array.isArray(albums) ? albums : []) as {
    slug?: string;
    title?: string;
    url?: string;
    photos?: { src?: string; thumb?: string }[];
  }[];
  for (const a of list) {
    if (!a.slug || !a.title || !a.url)
      problems.push(`album senza slug, title o url: ${JSON.stringify(a).slice(0, 80)}`);
    if (!Array.isArray(a.photos) || a.photos.length === 0) problems.push(`${a.slug}: nessuna foto`);
    else if (a.photos.some((p) => !p.src || !p.thumb)) problems.push(`${a.slug}: foto senza src o thumb`);
  }
  const slugs = new Set(list.map((a) => a.slug));
  for (const post of posts) {
    const slug = postAlbumSlug(post.text);
    if (slug && !slugs.has(slug)) problems.push(`${post.name} cita l'album "${slug}", che sull'archivio non c'è`);
  }
  return problems;
}
