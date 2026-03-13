export interface PageMeta {
  slug: string;
  slugEn: string;
  titleIt: string;
  titleEn: string;
  headerImage: string;
  descriptionIt: string;
  descriptionEn: string;
  category?: string;
  leadHtmlIt?: string;
  leadHtmlEn?: string;
  editionsTitleIt?: string;
  editionsTitleEn?: string;
  baseUrlIt?: string;
  baseUrlEn?: string;
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
    descriptionIt: 'Le città dove si gioca a VTES in Italia. Ogni principato ha il suo Principe.',
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
    category: 'tour',
    leadHtmlIt: '<p class="page-lead">Il <strong>VTES Italian Tour</strong> è una serie di tornei che si svolgono durante tutto l\'anno nei principali Principati italiani. Ogni tappa offre l\'opportunità di guadagnare punti per la <strong>classifica annuale</strong>, con i migliori giocatori pronti a contendersi il territorio.</p><p>Una competizione avvincente e strategica, dove ogni partita può fare la differenza nel cammino verso la vittoria finale.</p>',
    leadHtmlEn: '<p class="page-lead">The <strong>VTES Italian Tour</strong> is a series of tournaments held throughout the year across Italy\'s main Domains. Each stop offers the chance to earn points for the <strong>annual ranking</strong>, with the best players competing across the country.</p><p>A thrilling and strategic competition, where every game can make the difference on the road to the final victory.</p>',
    editionsTitleIt: 'Edizioni del Tour',
    editionsTitleEn: 'Tour Editions',
    baseUrlIt: '/tour/',
    baseUrlEn: '/en/tour/',
  },
  {
    slug: 'grand-prix',
    slugEn: 'grand-prix',
    titleIt: 'Grand Prix',
    titleEn: 'Grand Prix',
    headerImage: '/images/headers/header-grand-prix.webp',
    descriptionIt: 'Il Grand Prix italiano di VTES.',
    descriptionEn: 'The Italian VTES Grand Prix.',
    category: 'grand-prix',
    leadHtmlIt: '<p class="page-lead">Il <strong>Grand Prix italiano</strong> di Vampire: The Eternal Struggle è il <strong>torneo più atteso</strong> della stagione italiana. Appuntamento fisso del circuito europeo, aperto a tutti i Matusalemme pronti a mettersi alla prova tra <strong>intrighi</strong>, <strong>fragili alleanze</strong> e <strong>colpi di scena</strong>.</p><p>Porta il tuo mazzo, affila le strategie… e preparati a conquistare il potere nella <strong>lotta eterna per il dominio</strong>.</p>',
    leadHtmlEn: '<p class="page-lead">The <strong>Italian Grand Prix</strong> of Vampire: The Eternal Struggle is the <strong>most anticipated tournament event</strong> of the Italian season. A key fixture in the European circuit, open to all Methuselahs ready to test themselves through <strong>intrigue</strong>, <strong>fragile alliances</strong> and <strong>plot twists</strong>.</p><p>Bring your deck, sharpen your strategies… and prepare to claim power in the <strong>eternal struggle for domination</strong>.</p>',
    editionsTitleIt: 'Edizioni del Grand Prix',
    editionsTitleEn: 'Grand Prix Editions',
    baseUrlIt: '/grand-prix/',
    baseUrlEn: '/en/grand-prix/',
  },
  {
    slug: 'nazionale',
    slugEn: 'national-championship',
    titleIt: 'Nazionale',
    titleEn: 'National Championship',
    headerImage: '/images/headers/header-nazionale.webp',
    descriptionIt: 'Il Campionato Nazionale italiano di VTES.',
    descriptionEn: 'The Italian VTES National Championship.',
    category: 'nazionale',
    leadHtmlIt: '<p class="page-lead">Il <strong>Campionato Nazionale italiano di VTES</strong> è l\'evento annuale più atteso dalla community: un raduno che unisce <strong>competizione di alto livello</strong> e <strong>spirito conviviale</strong>, un vero rituale per i Cainiti italiani dove <strong>strategia</strong>, <strong>passione</strong> e <strong>prestigio</strong> si intrecciano.</p><p>Il torneo prevede <strong>3 gironi + finale</strong>, con iscrizione e decklist obbligatorie su BCN. Il vincitore viene incoronato <strong>Campione d\'Italia</strong>.</p>',
    leadHtmlEn: '<p class="page-lead">The <strong>Italian VTES National Championship</strong> is the most anticipated annual event in the community: a gathering that combines <strong>high-level competition</strong> and <strong>convivial spirit</strong>, a true ritual for Italian Cainites where <strong>strategy</strong>, <strong>passion</strong> and <strong>prestige</strong> intertwine.</p><p>The tournament features <strong>3 rounds + finals</strong>, with mandatory registration and decklist on BCN. The winner is crowned <strong>Italian Champion</strong>.</p>',
    editionsTitleIt: 'Edizioni del Campionato',
    editionsTitleEn: 'Championship Editions',
    baseUrlIt: '/nazionale/',
    baseUrlEn: '/en/national-championship/',
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
