import type { Locale } from '../utils/i18n';

export interface PageMeta {
  slug: Record<Locale, string>;
  title: Record<Locale, string>;
  headerImage: string;
  ogImage: string;
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
    ogImage: '/images/og/og-home.jpg',
    description: {
      it: 'La community italiana di Vampire: The Eternal Struggle. Tornei, raduni e campionati in tutta Italia.',
      en: 'The Italian Methuselah community. Tournaments, gatherings and championships across Italy.',
    },
  },
  {
    slug: { it: 'principati', en: 'domains' },
    title: { it: 'Principati', en: 'The Domains' },
    headerImage: '/images/headers/header-principati.webp',
    ogImage: '/images/og/og-principati.jpg',
    description: {
      it: 'Le città dove si gioca a VTES in Italia. Ogni principato ha il suo Principe.',
      en: 'The cities where VTES is played in Italy. Each domain has its own Prince.',
    },
  },
  {
    slug: { it: 'tour', en: 'tour' },
    title: { it: 'Italian Tour', en: 'Italian Tour' },
    headerImage: '/images/headers/header-tour.webp',
    ogImage: '/images/og/og-tour.jpg',
    description: {
      it: 'Il VTES Italian Tour: il circuito annuale di tornei VTES nei Principati italiani, con tappe, classifica generale ed edizioni dal 2023.',
      en: 'The VTES Italian Tour: the annual circuit of VTES tournaments across the Italian Domains, with stages, overall ranking and editions since 2023.',
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
    ogImage: '/images/og/og-grand-prix.jpg',
    description: {
      it: 'Il Grand Prix italiano di VTES, torneo del circuito europeo aperto a tutti: date, sedi e risultati delle edizioni dal 2020.',
      en: 'The Italian VTES Grand Prix, a European circuit tournament open to everyone: dates, venues and results of the editions since 2020.',
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
    ogImage: '/images/og/og-nazionale.jpg',
    description: {
      it: "Il Campionato Nazionale italiano di VTES, un weekend all'anno per il titolo di Campione d'Italia: sedi, programma ed edizioni dal 2021.",
      en: 'The Italian VTES National Championship, one weekend a year to decide the Italian Champion: venues, schedule and editions since 2021.',
    },
    category: 'nazionale',
    leadHtml: {
      it: '<p class="page-lead">Il <strong>Campionato Nazionale italiano</strong> di Vampire: The Eternal Struggle è il <strong>rito annuale</strong> della community italiana. Un weekend che unisce <strong>competizione di alto livello</strong> e <strong>spirito conviviale</strong>, dove i Cainiti di tutta la penisola si contendono il titolo più prestigioso.</p><p>Prepara il tuo mazzo, studia gli avversari… e conquista il trono di <strong>Campione d\'Italia</strong>.</p>',
      en: '<p class="page-lead">The <strong>Italian National Championship</strong> of Vampire: The Eternal Struggle is the <strong>annual ritual</strong> of the Italian community. A weekend that blends <strong>high-level competition</strong> and <strong>convivial spirit</strong>, where Cainites from across the country battle for the most prestigious title.</p><p>Prepare your deck, study your rivals… and claim the throne of <strong>Italian Champion</strong>.</p>',
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
    ogImage: '/images/og/og-cartoline.jpg',
    description: {
      it: 'Foto ironiche di carte VTES dalla community italiana, raccolte in gallerie per evento: tornei locali, Grand Prix e Campionati Nazionali.',
      en: 'Ironic VTES card photos from the Italian community, collected in galleries by event: local tournaments, Grand Prix and National Championships.',
    },
  },
  {
    slug: { it: 'gemelli', en: 'twins' },
    title: { it: 'Gemelli', en: 'Twins' },
    headerImage: '/images/headers/header-gemelli.webp',
    ogImage: '/images/og/og-gemelli.jpg',
    description: {
      it: 'Confronti tra personaggi VTES e figure reali: i volti delle carte accostati ai cantanti, attori e personaggi pubblici a cui somigliano.',
      en: 'Comparisons between VTES characters and real-world figures: faces from the cards set beside the singers, actors and public figures they resemble.',
    },
  },
  {
    slug: { it: 'comunita', en: 'community' },
    title: { it: 'Comunità', en: 'Community' },
    headerImage: '/images/headers/header-comunita.webp',
    ogImage: '/images/og/og-comunita.jpg',
    description: {
      it: 'Articoli, report e novità dalla comunità VTES Italia.',
      en: 'Articles, reports and news from the Italian VTES community.',
    },
  },
];
