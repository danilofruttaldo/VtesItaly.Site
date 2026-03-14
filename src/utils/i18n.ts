import itStrings from '../i18n/it.json';
import enStrings from '../i18n/en.json';

/** All supported locales — add new languages here only */
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
  return posts.filter(p => (p.data.locale || DEFAULT_LOCALE) === locale);
}

/** URL prefix for a given locale (empty string for default locale) */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/** Get all other locales except the given one */
export function getOtherLocales(locale: Locale): Locale[] {
  return LOCALES.filter(l => l !== locale);
}

/** Format a date using the locale's date format string from translations */
export function formatLocalDate(date: Date, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  const t = translations[locale];
  return date.toLocaleDateString(t.date_locale, opts ?? { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Build the alternate-language URL for hreflang and language switcher */
export function getAlternateUrl(url: URL, targetLocale: Locale): string {
  const path = url.pathname;
  const slugMap = enStrings.slug_map as Record<string, string>;
  const reverseSlugMap = Object.fromEntries(
    Object.entries(slugMap).map(([en, it]) => [it, en])
  );

  if (targetLocale === 'en') {
    // IT → EN: add /en/ prefix and map slugs
    let enPath = '/en' + path;
    for (const [itSlug, enSlug] of Object.entries(reverseSlugMap)) {
      enPath = enPath.replace(`/${itSlug}`, `/${enSlug}`);
    }
    return enPath;
  } else {
    // EN → IT: remove /en/ prefix and map slugs back
    let itPath = path.replace(/^\/en/, '') || '/';
    for (const [enSlug, itSlug] of Object.entries(slugMap)) {
      itPath = itPath.replace(`/${enSlug}`, `/${itSlug}`);
    }
    return itPath;
  }
}
