import type { Locale } from '../utils/i18n';

export interface PageMeta {
  slug: Record<Locale, string>;
  title: Record<Locale, string>;
  headerImage: string;
  description: Record<Locale, string>;
  category?: string;
  leadHtml?: Record<Locale, string>;
  editionsTitle?: Record<Locale, string>;
  baseUrl?: Record<Locale, string>;
}

export const mainPages: PageMeta[] = [
  {
    slug: { it: '', en: '' },
    title: { it: 'Home', en: 'Home' },
    headerImage: '/images/headers/header-home.webp',
    description: {
      it: 'La community italiana di Vampire: The Eternal Struggle. Tornei, raduni e campionati in tutta Italia.',
      en: 'The Italian Methuselah community. Tournaments, gatherings and championships across Italy.',
    },
  },
  {
    slug: { it: 'principati', en: 'domains' },
    title: { it: 'Principati', en: 'The Domains' },
    headerImage: '/images/headers/header-principati.webp',
    description: {
      it: 'Le città dove si gioca a VTES in Italia. Ogni principato ha il suo Principe.',
      en: 'The cities where VTES is played in Italy. Each domain has its own Prince.',
    },
  },
  {
    slug: { it: 'tour', en: 'tour' },
    title: { it: 'Italian Tour', en: 'Italian Tour' },
    headerImage: '/images/headers/header-tour.webp',
    description: {
      it: 'Il circuito di tornei VTES in Italia.',
      en: 'The VTES tournament circuit in Italy.',
    },
    category: 'tour',
    leadHtml: {
      it: '<p class="page-lead">Il <strong>VTES Italian Tour</strong> è una serie di tornei che si svolgono durante tutto l\'anno nei principali Principati italiani. Ogni tappa offre l\'opportunità di guadagnare punti per la <strong>classifica annuale</strong>, con i migliori giocatori pronti a contendersi il territorio.</p><p>Una competizione avvincente e strategica, dove ogni partita può fare la differenza nel cammino verso la vittoria finale.</p>',
      en: '<p class="page-lead">The <strong>VTES Italian Tour</strong> is a series of tournaments held throughout the year across Italy\'s main Domains. Each stop offers the chance to earn points for the <strong>annual ranking</strong>, with the best players competing across the country.</p><p>A thrilling and strategic competition, where every game can make the difference on the road to the final victory.</p>',
    },
    editionsTitle: {
      it: 'Edizioni del Tour',
      en: 'Tour Editions',
    },
    baseUrl: {
      it: '/tour/',
      en: '/en/tour/',
    },
  },
  {
    slug: { it: 'grand-prix', en: 'grand-prix' },
    title: { it: 'Grand Prix', en: 'Grand Prix' },
    headerImage: '/images/headers/header-grand-prix.webp',
    description: {
      it: 'Il Grand Prix italiano di VTES.',
      en: 'The Italian VTES Grand Prix.',
    },
    category: 'grand-prix',
    leadHtml: {
      it: '<p class="page-lead">Il <strong>Grand Prix italiano</strong> di Vampire: The Eternal Struggle è il <strong>torneo più atteso</strong> della stagione italiana. Appuntamento fisso del circuito europeo, aperto a tutti i Matusalemme pronti a mettersi alla prova tra <strong>intrighi</strong>, <strong>fragili alleanze</strong> e <strong>colpi di scena</strong>.</p><p>Porta il tuo mazzo, affila le strategie… e preparati a conquistare il potere nella <strong>lotta eterna per il dominio</strong>.</p>',
      en: '<p class="page-lead">The <strong>Italian Grand Prix</strong> of Vampire: The Eternal Struggle is the <strong>most anticipated tournament event</strong> of the Italian season. A key fixture in the European circuit, open to all Methuselahs ready to test themselves through <strong>intrigue</strong>, <strong>fragile alliances</strong> and <strong>plot twists</strong>.</p><p>Bring your deck, sharpen your strategies… and prepare to claim power in the <strong>eternal struggle for domination</strong>.</p>',
    },
    editionsTitle: {
      it: 'Edizioni del Grand Prix',
      en: 'Grand Prix Editions',
    },
    baseUrl: {
      it: '/grand-prix/',
      en: '/en/grand-prix/',
    },
  },
  {
    slug: { it: 'nazionale', en: 'national-championship' },
    title: { it: 'Nazionale', en: 'National Championship' },
    headerImage: '/images/headers/header-nazionale.webp',
    description: {
      it: 'Il Campionato Nazionale italiano di VTES.',
      en: 'The Italian VTES National Championship.',
    },
    category: 'nazionale',
    leadHtml: {
      it: '<p class="page-lead">Il <strong>Campionato Nazionale italiano di VTES</strong> è l\'evento annuale più atteso dalla community: un raduno che unisce <strong>competizione di alto livello</strong> e <strong>spirito conviviale</strong>, un vero rituale per i Cainiti italiani dove <strong>strategia</strong>, <strong>passione</strong> e <strong>prestigio</strong> si intrecciano.</p><p>Il torneo prevede <strong>3 gironi + finale</strong>, con iscrizione e decklist obbligatorie su BCN. Il vincitore viene incoronato <strong>Campione d\'Italia</strong>.</p>',
      en: '<p class="page-lead">The <strong>Italian VTES National Championship</strong> is the most anticipated annual event in the community: a gathering that combines <strong>high-level competition</strong> and <strong>convivial spirit</strong>, a true ritual for Italian Cainites where <strong>strategy</strong>, <strong>passion</strong> and <strong>prestige</strong> intertwine.</p><p>The tournament features <strong>3 rounds + finals</strong>, with mandatory registration and decklist on BCN. The winner is crowned <strong>Italian Champion</strong>.</p>',
    },
    editionsTitle: {
      it: 'Edizioni del Campionato',
      en: 'Championship Editions',
    },
    baseUrl: {
      it: '/nazionale/',
      en: '/en/national-championship/',
    },
  },
  {
    slug: { it: 'cartoline', en: 'postcards' },
    title: { it: 'Cartoline', en: 'Postcards' },
    headerImage: '/images/headers/header-cartoline.webp',
    description: {
      it: 'Foto ironiche di carte VTES dalla community.',
      en: 'Ironic VTES card photos from the community.',
    },
  },
  {
    slug: { it: 'gemelli', en: 'twins' },
    title: { it: 'Gemelli', en: 'Twins' },
    headerImage: '/images/headers/header-gemelli.webp',
    description: {
      it: 'Confronti tra personaggi VTES e figure reali.',
      en: 'Comparisons between VTES characters and real-world figures.',
    },
  },
  {
    slug: { it: 'week-of-sabbat', en: 'week-of-sabbat' },
    title: { it: 'Week of Sabbat', en: 'Week of Sabbat' },
    headerImage: '/images/headers/header-week-of-sabbat.webp',
    description: {
      it: 'L\'evento speciale Week of Sabbat.',
      en: 'The Week of Sabbat special event.',
    },
  },
  {
    slug: { it: 'comunita', en: 'community' },
    title: { it: 'Comunità', en: 'Community' },
    headerImage: '/images/headers/header-home.webp',
    description: {
      it: 'Articoli, report e novità dalla comunità VTES Italia.',
      en: 'Articles, reports and news from the Italian VTES community.',
    },
  },
];
