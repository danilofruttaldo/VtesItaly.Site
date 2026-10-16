/**
 * Sitemap helpers for @astrojs/sitemap, used by astro.config.mjs.
 *
 * The config runs before the content collections exist, so there is no
 * `astro:content` here: the frontmatter is read by hand, and one line is
 * enough (`date:` for posts, `aggiornato:` for guides).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { translatePostSlug, translateSection } from './i18n';

/**
 * Pages that say `noindex` must stay out of the sitemap: listing them asks a
 * search engine to index a page that tells it not to. Today these are the
 * community archive pages after the first (/comunita/2/, /en/community/2/)
 * and the 404 pages.
 */
export function sitemapFilter(page: string): boolean {
  const path = new URL(page).pathname;
  if (/^\/(en\/community|comunita)\/\d+\/$/.test(path)) return false;
  if (/^(\/en)?\/404(\/|\.html)?$/.test(path)) return false;
  return true;
}

function frontmatter(file: string): string {
  return readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
}

function field(fm: string, name: string): string | undefined {
  return new RegExp(`^${name}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm').exec(fm)?.[1];
}

/**
 * Page path (with trailing slash) -> last content date, for `<lastmod>`.
 *
 * Future dates are left out: an event post is dated on the day it is played,
 * and a `lastmod` in the future is discarded by search engines as wrong.
 * Index pages get no date: theirs would be the build day, a change claimed
 * at every deploy.
 */
export function sitemapDates(root = process.cwd(), now = new Date()): Map<string, Date> {
  const dates = new Map<string, Date>();
  const add = (path: string, day: string | undefined) => {
    if (!day) return;
    const d = new Date(`${day}T00:00:00Z`);
    if (d.getTime() <= now.getTime()) dates.set(path, d);
  };

  const blog = join(root, 'src/content/blog');
  for (const file of readdirSync(blog).filter((f) => f.endsWith('.md'))) {
    const fm = frontmatter(join(blog, file));
    const id = file.replace(/\.md$/, '');
    const category = /^category:\s*['"]?([a-z-]+)/m.exec(fm)?.[1];
    if (!category) continue;
    const isEn = /^locale:\s*['"]?en\b/m.test(fm);
    const path = isEn
      ? `/en/${translateSection(category, 'en')}/${translatePostSlug(category, id.replace(/-en$/, ''), 'en')}/`
      : `/${category}/${id}/`;
    add(path, field(fm, 'date'));
  }

  const guides = join(root, 'src/content/guide');
  for (const file of readdirSync(guides).filter((f) => f.endsWith('.md'))) {
    const fm = frontmatter(join(guides, file));
    const id = file.replace(/\.md$/, '');
    const isEn = /^locale:\s*['"]?en\b/m.test(fm);
    add(isEn ? `/en/guides/${id.replace(/-en$/, '')}/` : `/guide/${id}/`, field(fm, 'aggiornato'));
  }
  return dates;
}
