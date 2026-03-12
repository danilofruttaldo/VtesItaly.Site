import itStrings from '../i18n/it.json';
import enStrings from '../i18n/en.json';

export type Locale = 'it' | 'en';

const translations: Record<Locale, typeof itStrings> = {
  it: itStrings,
  en: enStrings,
};

export function useTranslations(locale: Locale) {
  return translations[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const path = url.pathname;
  if (path.startsWith('/en/') || path === '/en') {
    return 'en';
  }
  return 'it';
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
