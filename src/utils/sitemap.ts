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
import { categoryUrls } from '../data/categories';
import { contentGitDates } from './git-dates';

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
 * A post's date is its last commit (utils/git-dates); without git history,
 * its frontmatter `date`. Future dates are left out: an event post is dated
 * on the day it is played, and a `lastmod` in the future is discarded by
 * search engines as wrong. Guides use their curated `aggiornato`. The home
 * and the section hubs take the latest date of the posts they list, never
 * the build day, which would claim a change at every deploy.
 */
export function sitemapDates(
  root = process.cwd(),
  now = new Date(),
  gitDates = contentGitDates(root),
): Map<string, Date> {
  const dates = new Map<string, Date>();
  const add = (path: string, day: string | undefined) => {
    if (!day) return;
    const d = new Date(`${day}T00:00:00Z`);
    if (d.getTime() > now.getTime()) return;
    dates.set(path, d);
    return d;
  };
  // Hub path -> latest date among its posts
  const hubs = new Map<string, Date>();
  const bump = (hub: string, d: Date | undefined) => {
    if (d && (!hubs.get(hub) || d > hubs.get(hub)!)) hubs.set(hub, d);
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
    const day = gitDates.get(`src/content/blog/${file}`)?.modified ?? field(fm, 'date');
    const d = add(path, day);
    const locale = isEn ? 'en' : 'it';
    bump(locale === 'en' ? '/en/' : '/', d);
    const hub = categoryUrls[category]?.[locale];
    if (hub) bump(hub, d);
  }

  const guides = join(root, 'src/content/guide');
  for (const file of readdirSync(guides).filter((f) => f.endsWith('.md'))) {
    const fm = frontmatter(join(guides, file));
    const id = file.replace(/\.md$/, '');
    const isEn = /^locale:\s*['"]?en\b/m.test(fm);
    const d = add(isEn ? `/en/guides/${id.replace(/-en$/, '')}/` : `/guide/${id}/`, field(fm, 'aggiornato'));
    bump(isEn ? '/en/guides/' : '/guide/', d);
  }
  for (const [hub, d] of hubs) dates.set(hub, d);
  return dates;
}
