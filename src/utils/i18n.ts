import itStrings from '../i18n/it.json';
import enStrings from '../i18n/en.json';

/** All supported locales - add new languages here only */
export const LOCALES = ['it', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'it';

const translations: Record<Locale, typeof itStrings> = {
  it: itStrings,
  en: enStrings,
};

export function useTranslations(locale: Locale) {
  return translations[locale];
}

const NON_DEFAULT_LOCALES = LOCALES.filter((l): l is Exclude<Locale, typeof DEFAULT_LOCALE> => l !== DEFAULT_LOCALE);

export function getLocaleFromUrl(url: URL): Locale {
  const path = url.pathname;
  for (const loc of NON_DEFAULT_LOCALES) {
    if (path.startsWith(`/${loc}/`) || path === `/${loc}`) {
      return loc;
    }
  }
  return DEFAULT_LOCALE;
}

/** Filter a collection of posts by locale (defaults to DEFAULT_LOCALE when post has no locale set) */
export function filterByLocale<T extends { data: { locale?: string } }>(posts: T[], locale: Locale): T[] {
  return posts.filter((p) => (p.data.locale || DEFAULT_LOCALE) === locale);
}

/** URL prefix for a given locale (empty string for default locale) */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Get all other locales except the given one */
export function getOtherLocales(locale: Locale): Locale[] {
  return LOCALES.filter((l) => l !== locale);
}

/** Format a date using the locale's date format string from translations.
 *  In UTC: frontmatter dates are midnight UTC, and the build machine's own
 *  timezone would turn 1 March into 28 February west of Greenwich. */
export function formatLocalDate(date: Date, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  const t = translations[locale];
  return date.toLocaleDateString(t.date_locale, {
    ...(opts ?? { day: 'numeric', month: 'long', year: 'numeric' }),
    timeZone: 'UTC',
  });
}

/** EN section slug -> IT section slug (`domains` -> `principati`), from en.json. */
const EN_TO_IT_SECTION = enStrings.slug_map as Record<string, string>;
const IT_TO_EN_SECTION = Object.fromEntries(Object.entries(EN_TO_IT_SECTION).map(([en, it]) => [it, en]));

/** Section (first path segment) in the other language; unmapped ones stay as they are. */
export function translateSection(section: string, targetLocale: Locale): string {
  const map = targetLocale === 'en' ? IT_TO_EN_SECTION : EN_TO_IT_SECTION;
  return map[section] ?? section;
}

/** Sections whose post slugs change prefix with the language: [Italian, English]. */
const POST_SLUG_PREFIXES: Record<string, [string, string]> = {
  nazionale: ['nazionale', 'nc'],
  europeo: ['europeo', 'ec'],
};

/**
 * Post slug in the other language. National Championship posts are
 * `nazionale-2026` in Italian and `nc-2026` in English, European ones
 * `europeo-2005` and `ec-2005`; every other slug is the same in both. `itSection` is the Italian section the post lives in.
 * The one mapping used by the EN routes, the EN post URLs and the hreflang
 * alternates, so the three can never disagree.
 */
export function translatePostSlug(itSection: string, slug: string, targetLocale: Locale): string {
  const prefix = POST_SLUG_PREFIXES[itSection];
  if (!prefix) return slug;
  const [it, en] = prefix;
  return targetLocale === 'en'
    ? slug.replace(new RegExp(`^${it}-`), `${en}-`)
    : slug.replace(new RegExp(`^${en}-`), `${it}-`);
}

/**
 * The 404 page has no address of its own: Apache serves /404.html in place of
 * whatever was requested. Its counterparts are fixed.
 */
const NOT_FOUND_ALTERNATES: Record<Locale, string> = { it: '/404.html', en: '/en/404/' };

/** Build the alternate-language URL for hreflang and language switcher */
export function getAlternateUrl(url: URL, targetLocale: Locale): string {
  const path = url.pathname;
  if (/^(\/en)?\/404(\.html|\/)?$/.test(path)) return NOT_FOUND_ALTERNATES[targetLocale];
  const sourceLocale = getLocaleFromUrl(url);
  // Segments without the locale prefix: ['nazionale', 'nazionale-2026'].
  const segments = path.split('/').filter(Boolean);
  if (sourceLocale !== DEFAULT_LOCALE) segments.shift();
  if (sourceLocale !== targetLocale && segments.length > 0) {
    const itSection = sourceLocale === 'en' ? translateSection(segments[0], 'it') : segments[0];
    segments[0] = translateSection(segments[0], targetLocale);
    if (segments.length > 1) segments[1] = translatePostSlug(itSection, segments[1], targetLocale);
  }
  const trailing = path.endsWith('/') || segments.length === 0 ? '/' : '';
  const body = segments.length > 0 ? '/' + segments.join('/') + trailing : '/';
  return targetLocale === DEFAULT_LOCALE ? body : `/${targetLocale}${body}`;
}
