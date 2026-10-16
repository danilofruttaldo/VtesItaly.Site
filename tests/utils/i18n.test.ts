import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  DEFAULT_LOCALE,
  useTranslations,
  getLocaleFromUrl,
  filterByLocale,
  localePrefix,
  getOtherLocales,
  formatLocalDate,
  getAlternateUrl,
  translatePostSlug,
  translateSection,
} from '../../src/utils/i18n';

const url = (path: string) => new URL(`https://vtesitaly.com${path}`);

describe('i18n: constants', () => {
  it('lists exactly the supported locales with IT as default', () => {
    expect([...LOCALES]).toEqual(['it', 'en']);
    expect(DEFAULT_LOCALE).toBe('it');
  });
});

describe('i18n: useTranslations', () => {
  it('returns IT and EN bundles', () => {
    expect(useTranslations('it')).toBeTruthy();
    expect(useTranslations('en')).toBeTruthy();
  });
});

describe('i18n: getLocaleFromUrl', () => {
  it('defaults to IT for the root and IT-prefixed paths', () => {
    expect(getLocaleFromUrl(url('/'))).toBe('it');
    expect(getLocaleFromUrl(url('/grand-prix/'))).toBe('it');
    expect(getLocaleFromUrl(url('/principati/torino/'))).toBe('it');
  });

  it('detects EN from /en or /en/...', () => {
    expect(getLocaleFromUrl(url('/en'))).toBe('en');
    expect(getLocaleFromUrl(url('/en/'))).toBe('en');
    expect(getLocaleFromUrl(url('/en/grand-prix/'))).toBe('en');
  });

  it('does NOT false-positive on paths that merely start with "en"', () => {
    // Regression guard: /endurance/ must not be detected as EN.
    expect(getLocaleFromUrl(url('/endurance/'))).toBe('it');
    expect(getLocaleFromUrl(url('/enable-something/'))).toBe('it');
  });
});

describe('i18n: filterByLocale', () => {
  const posts = [
    { data: { locale: 'it', title: 'A' } },
    { data: { locale: 'en', title: 'B' } },
    { data: { title: 'C-no-locale' } }, // no locale → defaults to IT
  ];

  it('keeps only posts matching the target locale', () => {
    expect(filterByLocale(posts, 'en').map((p) => p.data.title)).toEqual(['B']);
  });

  it('treats missing locale as DEFAULT_LOCALE', () => {
    expect(filterByLocale(posts, 'it').map((p) => p.data.title)).toEqual(['A', 'C-no-locale']);
  });
});

describe('i18n: localePrefix', () => {
  it('returns empty string for the default locale', () => {
    expect(localePrefix('it')).toBe('');
  });
  it('returns /<locale> for non-default locales', () => {
    expect(localePrefix('en')).toBe('/en');
  });
});

describe('i18n: getOtherLocales', () => {
  it('returns every other locale', () => {
    expect(getOtherLocales('it')).toEqual(['en']);
    expect(getOtherLocales('en')).toEqual(['it']);
  });
});

describe('i18n: formatLocalDate', () => {
  const sample = new Date(Date.UTC(2026, 3, 21));

  it('formats in IT locale', () => {
    const out = formatLocalDate(sample, 'it');
    // IT month name "aprile" must appear (or the day "21", locale-tolerant)
    expect(out.toLowerCase()).toContain('aprile');
    expect(out).toContain('2026');
  });

  it('formats in EN locale', () => {
    const out = formatLocalDate(sample, 'en');
    expect(out.toLowerCase()).toContain('april');
    expect(out).toContain('2026');
  });

  it('honors caller-provided Intl options', () => {
    const out = formatLocalDate(sample, 'it', { day: 'numeric', month: 'short' });
    // 'short' format should not contain the long month name "aprile"
    expect(out.toLowerCase()).not.toContain('aprile');
  });
});

describe('i18n: getAlternateUrl (hreflang + slug remap)', () => {
  it('IT root → /en/', () => {
    expect(getAlternateUrl(url('/'), 'en')).toBe('/en/');
  });

  it('EN root → /', () => {
    expect(getAlternateUrl(url('/en/'), 'it')).toBe('/');
  });

  it('IT /principati/ → /en/domains/ (slug remapped)', () => {
    expect(getAlternateUrl(url('/principati/'), 'en')).toBe('/en/domains/');
  });

  it('EN /en/domains/ → /principati/ (slug remapped back)', () => {
    expect(getAlternateUrl(url('/en/domains/'), 'it')).toBe('/principati/');
  });

  it('round-trips IT ↔ EN for every mapped slug', () => {
    const cases: Array<[string, string]> = [
      ['/principati/', '/en/domains/'],
      ['/nazionale/', '/en/national-championship/'],
      ['/cartoline/', '/en/postcards/'],
      ['/gemelli/', '/en/twins/'],
      ['/comunita/', '/en/community/'],
    ];
    for (const [it, en] of cases) {
      expect(getAlternateUrl(url(it), 'en')).toBe(en);
      expect(getAlternateUrl(url(en), 'it')).toBe(it);
    }
  });

  it('preserves nested paths under a remapped slug', () => {
    expect(getAlternateUrl(url('/principati/torino/'), 'en')).toBe('/en/domains/torino/');
    expect(getAlternateUrl(url('/en/community/week-of-sabbat-2025/'), 'it')).toBe('/comunita/week-of-sabbat-2025/');
  });
});

describe('i18n: shared slug mapping', () => {
  it('translates the section segment both ways and leaves unmapped ones alone', () => {
    expect(translateSection('nazionale', 'en')).toBe('national-championship');
    expect(translateSection('community', 'it')).toBe('comunita');
    expect(translateSection('tour', 'en')).toBe('tour');
  });

  it('maps nazionale-YYYY <-> nc-YYYY only inside the National Championship', () => {
    expect(translatePostSlug('nazionale', 'nazionale-2026', 'en')).toBe('nc-2026');
    expect(translatePostSlug('nazionale', 'nc-2026', 'it')).toBe('nazionale-2026');
    expect(translatePostSlug('comunita', 'nazionale-party', 'en')).toBe('nazionale-party');
  });

  it('gives the hreflang alternate of a National Championship post with the nc- slug', () => {
    expect(getAlternateUrl(url('/nazionale/nazionale-2026/'), 'en')).toBe('/en/national-championship/nc-2026/');
    expect(getAlternateUrl(url('/en/national-championship/nc-2026/'), 'it')).toBe('/nazionale/nazionale-2026/');
  });

  it('maps only whole segments: a slug that merely contains a section name is untouched', () => {
    expect(getAlternateUrl(url('/comunita/guide-alla-lega/'), 'en')).toBe('/en/community/guide-alla-lega/');
  });

  it('keeps the trailing-slash form of the source path', () => {
    expect(getAlternateUrl(url('/principati'), 'en')).toBe('/en/domains');
    expect(getAlternateUrl(url('/en'), 'it')).toBe('/');
  });

  it('returns the same path when the target is the current locale', () => {
    expect(getAlternateUrl(url('/en/tour/'), 'en')).toBe('/en/tour/');
  });

  it('pairs the two 404 pages', () => {
    expect(getAlternateUrl(url('/404.html'), 'en')).toBe('/en/404/');
    expect(getAlternateUrl(url('/404'), 'en')).toBe('/en/404/');
    expect(getAlternateUrl(url('/en/404/'), 'it')).toBe('/404.html');
  });
});

describe('i18n: formatLocalDate in UTC', () => {
  it('prints the frontmatter day whatever the process timezone', () => {
    // Midnight UTC is still the previous evening west of Greenwich.
    expect(formatLocalDate(new Date('2026-03-01'), 'it')).toBe('1 marzo 2026');
  });
});
