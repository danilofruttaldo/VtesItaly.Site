import type { Locale } from '../utils/i18n';

export const categoryLabels: Record<string, Record<Locale, string>> = {
  'comunita': { it: 'Comunità', en: 'Community' },
  'tour': { it: 'Tour', en: 'Tour' },
  'grand-prix': { it: 'Grand Prix', en: 'Grand Prix' },
  'nazionale': { it: 'Nazionale', en: 'National Championship' },
  'contest': { it: 'Contest', en: 'Contest' },
};

/** Map category slug to its parent page URL */
export const categoryUrls: Record<string, Record<Locale, string>> = {
  'comunita': { it: '/comunita/', en: '/en/community/' },
  'tour': { it: '/tour/', en: '/en/tour/' },
  'grand-prix': { it: '/grand-prix/', en: '/en/grand-prix/' },
  'nazionale': { it: '/nazionale/', en: '/en/national-championship/' },
  'contest': { it: '/comunita/', en: '/en/community/' },
};
