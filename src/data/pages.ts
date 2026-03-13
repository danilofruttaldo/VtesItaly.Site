export interface PageMeta {
  slug: string;
  slugEn: string;
  titleIt: string;
  titleEn: string;
  headerImage: string;
  descriptionIt: string;
  descriptionEn: string;
}

export const mainPages: PageMeta[] = [
  {
    slug: '',
    slugEn: '',
    titleIt: 'Home',
    titleEn: 'Home',
    headerImage: '/images/headers/header-home.webp',
    descriptionIt: 'La community italiana di Vampire: The Eternal Struggle. Tornei, raduni e campionati in tutta Italia.',
    descriptionEn: 'The Italian Methuselah community. Tournaments, gatherings and championships across Italy.',
  },
  {
    slug: 'principati',
    slugEn: 'domains',
    titleIt: 'Principati',
    titleEn: 'The Domains',
    headerImage: '/images/headers/header-principati.webp',
    descriptionIt: 'Le citta dove si gioca a VTES in Italia. Ogni principato ha il suo Principe.',
    descriptionEn: 'The cities where VTES is played in Italy. Each domain has its own Prince.',
  },
  {
    slug: 'tour',
    slugEn: 'tour',
    titleIt: 'Italian Tour',
    titleEn: 'Italian Tour',
    headerImage: '/images/headers/header-tour.webp',
    descriptionIt: 'Il circuito di tornei VTES in Italia.',
    descriptionEn: 'The VTES tournament circuit in Italy.',
  },
  {
    slug: 'grand-prix',
    slugEn: 'grand-prix',
    titleIt: 'Grand Prix',
    titleEn: 'Grand Prix',
    headerImage: '/images/headers/header-grand-prix.webp',
    descriptionIt: 'Il Grand Prix italiano di VTES.',
    descriptionEn: 'The Italian VTES Grand Prix.',
  },
  {
    slug: 'nazionale',
    slugEn: 'national-championship',
    titleIt: 'Nazionale',
    titleEn: 'National Championship',
    headerImage: '/images/headers/header-nazionale.webp',
    descriptionIt: 'Il Campionato Nazionale italiano di VTES.',
    descriptionEn: 'The Italian VTES National Championship.',
  },
  {
    slug: 'cartoline',
    slugEn: 'postcards',
    titleIt: 'Cartoline',
    titleEn: 'Postcards',
    headerImage: '/images/headers/header-cartoline.webp',
    descriptionIt: 'Foto ironiche di carte VTES dalla community.',
    descriptionEn: 'Ironic VTES card photos from the community.',
  },
  {
    slug: 'gemelli',
    slugEn: 'twins',
    titleIt: 'Gemelli',
    titleEn: 'Twins',
    headerImage: '/images/headers/header-gemelli.webp',
    descriptionIt: 'Confronti tra personaggi VTES e figure reali.',
    descriptionEn: 'Comparisons between VTES characters and real-world figures.',
  },
  {
    slug: 'week-of-sabbat',
    slugEn: 'week-of-sabbat',
    titleIt: 'Week of Sabbat',
    titleEn: 'Week of Sabbat',
    headerImage: '/images/headers/header-week-of-sabbat.webp',
    descriptionIt: 'L\'evento speciale Week of Sabbat.',
    descriptionEn: 'The Week of Sabbat special event.',
  },
  {
    slug: 'comunita',
    slugEn: 'community',
    titleIt: 'Comunità',
    titleEn: 'Community',
    headerImage: '/images/headers/header-home.webp',
    descriptionIt: 'Articoli, report e novità dalla comunità VTES Italia.',
    descriptionEn: 'Articles, reports and news from the Italian VTES community.',
  },
];
