import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sitemapDates, sitemapFilter } from '../../src/utils/sitemap';

describe('sitemap: sitemapFilter', () => {
  it('drops the noindex archive pages and the 404s', () => {
    expect(sitemapFilter('https://vtesitaly.com/comunita/2/')).toBe(false);
    expect(sitemapFilter('https://vtesitaly.com/en/community/3/')).toBe(false);
    expect(sitemapFilter('https://vtesitaly.com/en/404/')).toBe(false);
    expect(sitemapFilter('https://vtesitaly.com/404/')).toBe(false);
  });

  it('keeps the first archive page and the posts', () => {
    expect(sitemapFilter('https://vtesitaly.com/comunita/')).toBe(true);
    expect(sitemapFilter('https://vtesitaly.com/comunita/play-bologna-2026/')).toBe(true);
    expect(sitemapFilter('https://vtesitaly.com/en/community/2026-recap/')).toBe(true);
  });
});

describe('sitemap: sitemapDates', () => {
  const root = mkdtempSync(join(tmpdir(), 'sitemap-'));
  mkdirSync(join(root, 'src/content/blog'), { recursive: true });
  mkdirSync(join(root, 'src/content/guide'), { recursive: true });
  const write = (dir: string, name: string, fm: string) =>
    writeFileSync(join(root, 'src/content', dir, name), `---\n${fm}\n---\n\nBody\n`);
  write('blog', 'nazionale-2026.md', "title: 'NC'\ndate: 2026-02-27\ncategory: 'nazionale'\nlocale: it");
  write('blog', 'nazionale-2026-en.md', "title: 'NC'\ndate: 2026-02-27\ncategory: 'nazionale'\nlocale: 'en'");
  write('blog', 'future.md', "date: 2027-01-01\ncategory: 'comunita'");
  write('blog', 'no-category.md', 'date: 2026-01-01');
  write('guide', 'demo-eventi.md', 'aggiornato: 2026-08-10\nlocale: it');
  write('guide', 'demo-eventi-en.md', 'aggiornato: 2026-08-11\nlocale: en');
  writeFileSync(join(root, 'src/content/guide', 'notes.txt'), 'ignored');

  const dates = sitemapDates(root, new Date('2026-10-16T12:00:00Z'), new Map());

  it('maps posts to their IT and EN paths, nc- slug included', () => {
    expect(dates.get('/nazionale/nazionale-2026/')?.toISOString()).toBe('2026-02-27T00:00:00.000Z');
    expect(dates.get('/en/national-championship/nc-2026/')?.toISOString()).toBe('2026-02-27T00:00:00.000Z');
  });

  it('maps guides to /guide/ and /en/guides/ with their update date', () => {
    expect(dates.get('/guide/demo-eventi/')?.toISOString()).toBe('2026-08-10T00:00:00.000Z');
    expect(dates.get('/en/guides/demo-eventi/')?.toISOString()).toBe('2026-08-11T00:00:00.000Z');
  });

  it('leaves out future dates and posts without a category', () => {
    expect(dates.has('/comunita/future/')).toBe(false);
    expect(dates.has('/comunita/')).toBe(false);
  });

  it('dates the home and the section hubs by their latest post or guide', () => {
    expect(dates.get('/')?.toISOString()).toBe('2026-02-27T00:00:00.000Z');
    expect(dates.get('/nazionale/')?.toISOString()).toBe('2026-02-27T00:00:00.000Z');
    expect(dates.get('/en/national-championship/')?.toISOString()).toBe('2026-02-27T00:00:00.000Z');
    expect(dates.get('/en/guides/')?.toISOString()).toBe('2026-08-11T00:00:00.000Z');
    expect(dates.size).toBe(10);
  });

  it('prefers the last commit day of a post over its event date', () => {
    const git = new Map([['src/content/blog/nazionale-2026.md', { created: '2026-01-10', modified: '2026-03-05' }]]);
    const withGit = sitemapDates(root, new Date('2026-10-16T12:00:00Z'), git);
    expect(withGit.get('/nazionale/nazionale-2026/')?.toISOString()).toBe('2026-03-05T00:00:00.000Z');
    expect(withGit.get('/nazionale/')?.toISOString()).toBe('2026-03-05T00:00:00.000Z');
  });

  it('dates the pages built from data files by their last commit', () => {
    const git = new Map([
      ['src/data/cities.ts', { created: '2026-03-12', modified: '2026-10-01' }],
      ['src/data/twins.ts', { created: '2026-03-12', modified: '2026-09-01' }],
    ]);
    const withGit = sitemapDates(root, new Date('2026-10-16T12:00:00Z'), git);
    expect(withGit.get('/principati/barga/')?.toISOString()).toBe('2026-10-01T00:00:00.000Z');
    expect(withGit.get('/en/domains/')?.toISOString()).toBe('2026-10-01T00:00:00.000Z');
    expect(withGit.get('/en/twins/')?.toISOString()).toBe('2026-09-01T00:00:00.000Z');
    expect(withGit.has('/cartoline/')).toBe(false);
  });
});
