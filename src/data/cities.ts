import type { Locale } from '../utils/i18n';

export interface MeetupPlace {
  name: string;
  address?: string;
  mapUrl?: string;
}

export interface MeetupEntry {
  day: Record<Locale, string>;
  time?: Record<Locale, string>;
  place: string;
  address?: string;
  mapUrl?: string;
  places?: MeetupPlace[];
}

export interface City {
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  region: string;
  prince: {
    name: string;
    alias: string;
    image: string;
    email?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    whatsappUrl?: string;
  };
  headerImage: string;
  description: Record<Locale, string>;
  meetupSchedule: MeetupEntry[];
  meetupNote?: Record<Locale, string>;
  mapUrl?: string;
  whatsappUrl?: string;
  tagId?: number;
  highlight?: {
    title: Record<Locale, string>;
    text: Record<Locale, string>;
    image?: string;
    link?: string;
  };
}

export const cities: City[] = [
  {
    slug: { it: 'barga', en: 'barga' },
    name: { it: 'Barga (LU)', en: 'Barga (LU)' },
    region: 'Toscana',
    prince: {
      name: 'Alessandro Donati',
      alias: 'Nekrós',
      image: '/images/principi/principi-alessandro-donati.webp',
      email: 'adonati1982@gmail.com',
    },
    headerImage: '/images/headers/header-barga.webp',
    description: {
      it: 'Community attiva nella valle del Serchio con partite settimanali e tornei presso la Garfaludica APS. Un punto di riferimento per i giocatori della Garfagnana e della Toscana nord-occidentale.',
      en: 'Active community in the Serchio valley with weekly games and tournaments at Garfaludica APS. A hub for players from Garfagnana and north-western Tuscany.',
    },
    meetupSchedule: [
      {
        day: { it: 'Mercoledì', en: 'Wednesday' },
        place: 'Garfaludica APS',
        address: 'Via Vittorio Emanuele snc, Castelnuovo di Garfagnana (LU)',
        mapUrl: 'https://maps.app.goo.gl/wBgKArtcPsC2SeAWA',
      },
    ],
    meetupNote: {
      it: 'Su richiesta, incontri anche sabato e domenica.',
      en: 'On request, meetups also on Saturday and Sunday.',
    },
    tagId: 18,
  },
  {
    slug: { it: 'bologna', en: 'bologna' },
    name: { it: 'Bologna', en: 'Bologna' },
    region: 'Emilia-Romagna',
    prince: {
      name: 'Federico Ferrarini',
      alias: 'Rip',
      image: '/images/principi/principi-federico-ferrarini.webp',
      email: 'fedemail83@gmail.com',
    },
    headerImage: '/images/headers/header-bologna.webp',
    description: {
      it: "Ritrovo al Circolo Barbanera con sessioni su più giorni della settimana. Una delle community più longeve dell'Emilia-Romagna.",
      en: 'Meetups at Circolo Barbanera with sessions on multiple days per week. One of the longest-running communities in Emilia-Romagna.',
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì\nVenerdì\nSabato', en: 'Thursday\nFriday\nSaturday' },
        place: 'Circolo Barbanera',
        address: 'Via Camillo Ranzani 13/2C, Bologna (BO)',
        mapUrl: 'https://maps.app.goo.gl/MPjAKGbuXq1yq6A99',
      },
    ],
    tagId: 17,
  },
  {
    slug: { it: 'elba', en: 'elba' },
    name: { it: 'Elba (LI)', en: 'Elba (LI)' },
    region: 'Toscana',
    prince: {
      name: 'Stefano Orlandini',
      alias: 'Ischemose',
      image: '/images/principi/principi-stefano-orlandini.webp',
      email: 'mordechaistrix@gmail.com',
    },
    headerImage: '/images/headers/header-elba.webp',
    description: {
      it: "Nuovo principato all'Elba con ritrovi settimanali il lunedì. Un punto di riferimento per i giocatori dell'arcipelago toscano.",
      en: 'New domain on Elba with weekly meetups on Mondays. A hub for players in the Tuscan archipelago.',
    },
    meetupSchedule: [
      {
        day: { it: 'Lunedì', en: 'Monday' },
        place: 'Scoglio-nati Viola Club / Sir Williams Pub',
        places: [
          { name: 'Scoglio-nati Viola Club', address: 'Via Carpani 251, Portoferraio (LI)', mapUrl: 'https://maps.app.goo.gl/rtCChp4yqxU8w6KYA' },
          { name: 'Sir Williams Pub', address: 'Via Rodolfo Manganaro 28, Portoferraio (LI)', mapUrl: 'https://maps.app.goo.gl/Uja61gRBd62Wf6tL9' },
        ],
      },
    ],
  },
  {
    slug: { it: 'firenze', en: 'firenze' },
    name: { it: 'Firenze', en: 'Firenze' },
    region: 'Toscana',
    prince: {
      name: 'Leonardo Bensi',
      alias: 'Mr. Banks',
      image: '/images/principi/principi-leonardo-bensi.webp',
      email: 'Vtesfirenze@gmail.com',
    },
    headerImage: '/images/headers/header-firenze.webp',
    description: {
      it: 'Principato fiorentino con ritrovi settimanali al Game in Via Baracca. Tre appuntamenti a settimana per tutti i giocatori!',
      en: 'Florentine domain with weekly meetups at Game on Via Baracca. Three sessions per week for all players!',
    },
    meetupSchedule: [
      {
        day: { it: 'Lunedì\nMercoledì\nVenerdì', en: 'Monday\nWednesday\nFriday' },
        place: 'Game',
        address: 'Via Francesco Baracca 168, Firenze (FI)',
        mapUrl: 'https://maps.app.goo.gl/pQwUsxtoHgRRw3Km6?g_st=aw',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/Fo0kloARBr0B4nvOKm9RVS',
    tagId: 19,
    highlight: {
      title: { it: 'Il Hobra Hai!', en: 'Il Hobra Hai!' },
      text: {
        it: '<em>Bleeda primo. Bleeda sodo. No Archon.</em><br>Nessun Matusalemme è al sicuro quando gli Hobra Hai siedono al tavolo. Che tu sia un neonato o un anziano, a Firenze e Prato c\'è un posto per te — e zero pietà.',
        en: '<em>Bleeda primo. Bleeda sodo. No Archon.</em><br>No Methuselah is safe when the Hobra Hai sit at the table. Whether you are a neonate or an elder, there is a seat for you in Firenze and Prato — and zero mercy.',
      },
      image: '/images/comunita/firenze-prato/hobra-hai.jpeg',
    },
  },
  {
    slug: { it: 'genova', en: 'genova' },
    name: { it: 'Genova', en: 'Genova' },
    region: 'Liguria',
    prince: {
      name: 'Alessandro Aprigliano',
      alias: 'Fan of Moss',
      image: '/images/principi/principi-alessandro-aprigliano.webp',
      email: 'alexdottrhino@gmail.com',
    },
    headerImage: '/images/headers/header-genova.webp',
    description: {
      it: 'Community ligure con incontri su richiesta. Un dominio giovane ma in crescita, aperto a nuovi giocatori.',
      en: 'Ligurian community with meetups on request. A young but growing domain, open to new players.',
    },
    meetupSchedule: [],
    tagId: 20,
  },
  {
    slug: { it: 'massa', en: 'massa' },
    name: { it: 'Massa', en: 'Massa' },
    region: 'Toscana',
    prince: {
      name: 'Davide Antoni',
      alias: 'The Look',
      image: '/images/principi/principi-davide-antoni.webp',
      email: 'massabynight@gmail.com',
    },
    headerImage: '/images/headers/header-massa.webp',
    description: {
      it: 'Community apuana con sessioni regolari allo Sporting Club Le Pinete. Punto di riferimento per giocatori tra Massa, Carrara, La Spezia e Viareggio.',
      en: 'Apuan community with regular sessions at Sporting Club Le Pinete. A hub for players from Massa, Carrara, La Spezia and Viareggio.',
    },
    meetupSchedule: [
      {
        day: { it: 'Lunedì\nMercoledì\nVenerdì', en: 'Monday\nWednesday\nFriday' },
        place: 'Associazione Ludica Apuana',
        address: 'Via San Ginese, Via Poveromo 15, Massa (MS)',
        mapUrl: 'https://maps.app.goo.gl/X1s6gBRCKJViPWew5',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EPKZ9BlvW5lG8CLQ6KqTV8',
    tagId: 21,
    highlight: {
      title: { it: 'Massa by Night – Comunità VTES', en: 'Massa by Night – VTES Community' },
      text: {
        it: 'Sei appassionato di Vampire: the Eternal Struggle o vorresti scoprire questo gioco? Stiamo cercando nuovi giocatori per espandere la community locale! Dai veterani ai neonati che vogliono imparare le regole, se abiti tra Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio e zone limitrofe, sei il benvenuto al tavolo!',
        en: 'Are you a fan of Vampire: the Eternal Struggle or would you like to discover this unique card game? We are looking for new players to expand our local community! From veterans to newcomers who want to learn the rules, if you live near Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio and surrounding areas, you are welcome at the table!',
      },
      image: '/images/comunita/massa/by-night.webp',
    },
  },
  {
    slug: { it: 'milano', en: 'milano' },
    name: { it: 'Milano', en: 'Milano' },
    region: 'Lombardia',
    prince: {
      name: 'Henry Hinde',
      alias: 'Acca',
      image: '/images/principi/principi-henry-hinde.webp',
      email: 'henry.hinde1973@gmail.com',
    },
    headerImage: '/images/headers/header-milano.webp',
    description: {
      it: "Uno dei principati più attivi d'Italia, con ritrovi settimanali alla Casa dei Giochi. Community accogliente con prestito mazzi per i nuovi giocatori.",
      en: "One of Italy's most active domains, with weekly meetups at Casa dei Giochi. Welcoming community with deck lending for new players.",
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì', en: 'Thursday' },
        place: 'La Casa dei Giochi',
        address: "Via Sant'Uguzzone 8, Milano (MI)",
        mapUrl: 'https://maps.app.goo.gl/YnLLiJ1cwJ1pR61b8',
      },
    ],
    meetupNote: { it: 'Altri giorni in base alla partecipazione.', en: 'Other days depending on attendance.' },
    whatsappUrl: 'https://chat.whatsapp.com/L15bwtkJQYx6OHceA7pLeW',
    tagId: 22,
    highlight: {
      title: { it: 'Nuovo giocatore? Impara a giocare con noi!', en: 'New player? Learn to play with us!' },
      text: {
        it: 'Sei un nuovo giocatore? Hai voglia di provare questo fantastico gioco? O semplicemente sei un vecchio giocatore a cui è tornata la voglia di bleedare? Contattaci: troverai la Community di Milano e dintorni (anche Bergamo) pronta ad accoglierti. Carte e segnalini sangue in omaggio per il tuo primo mazzo!',
        en: 'Are you a new player? Want to try this fantastic game? Or simply a veteran who got the urge to bleed again? Contact us: the Milano community (including Bergamo) is ready to welcome you. Free cards and blood counters for your first deck!',
      },
      image: '/images/comunita/milano/nuovo-giocatore.webp',
    },
  },
  {
    slug: { it: 'modena', en: 'modena' },
    name: { it: 'Modena', en: 'Modena' },
    region: 'Emilia-Romagna',
    prince: {
      name: 'Simone Parmeggiani',
      alias: 'Parmeg',
      image: '/images/principi/principi-simone-parmeggiani.webp',
      email: 'parmeggiani.simone@gmail.com',
    },
    headerImage: '/images/headers/header-modena.webp',
    description: {
      it: "Sessioni serali all'Alearum Mundus di Spilamberto e incontri occasionali alla Mutina Bellica. Community emiliana in espansione.",
      en: 'Evening sessions at Alearum Mundus in Spilamberto and occasional meetups at Mutina Bellica. A growing Emilian community.',
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì', en: 'Thursday' },
        time: { it: 'Orario serale', en: 'Evening' },
        place: 'Alearum Mundus',
        address: 'Via Castelnuovo R. 796, Spilamberto (MO)',
        mapUrl: 'https://maps.app.goo.gl/tFE6qCgpz2Xm7yyC6',
      },
      {
        day: { it: 'Occasionalmente', en: 'Occasionally' },
        place: 'Polisportiva Sacca',
        address: 'Via Alfonso Paltrinieri 80, Modena (MO)',
        mapUrl: 'https://maps.app.goo.gl/zM3ZGAqpYAAbH4KU9',
      },
    ],
    tagId: 23,
  },
  {
    slug: { it: 'parma', en: 'parma' },
    name: { it: 'Parma', en: 'Parma' },
    region: 'Emilia-Romagna',
    prince: {
      name: 'Leonardo Magri',
      alias: 'Kaiser',
      image: '/images/principi/principi-leonardo-magri.webp',
      email: 'leonardo.magri13@gmail.com',
      instagramUrl: 'https://www.instagram.com/leokaiser94/',
      facebookUrl: 'https://www.facebook.com/leonardo.l.magri',
      whatsappUrl: 'https://api.whatsapp.com/send/?phone=393341674036&text&type=phone_number&app_absent=0',
    },
    headerImage: '/images/headers/header-parma.webp',
    description: {
      it: 'Dominio emiliano con incontri su richiesta. Contatta il Principe per organizzare partite e conoscere la community locale.',
      en: 'Emilian domain with meetups on request. Contact the Prince to arrange games and meet the local community.',
    },
    meetupSchedule: [
      {
        day: { it: 'Su richiesta', en: 'On request' },
        place: 'Pub "La Corte di Odino" / Circolo Arci Argonne',
        places: [
          {
            name: 'La Corte di Odino',
            address: 'Via Mantova 72, Parma (PR)',
            mapUrl: 'https://maps.app.goo.gl/167Rvk6NbJ6n19Xs9',
          },
          {
            name: 'Circolo Arci Argonne',
            address: 'Via Argonne 4, Parma (PR)',
            mapUrl: 'https://maps.app.goo.gl/S3tr9NuWXKJx5ufe6',
          },
        ],
      },
    ],
    tagId: 24,
    highlight: {
      title: { it: 'Principato, Gioco e Community', en: 'Domain, Game and Community' },
      text: {
        it: "Il Principato di Parma si basa su tre regole fondamentali: Divertimento, Compagnia e Gruppo. La cosa più importante è mantenere il sorriso e vivere il gioco come un'esperienza di svago. \"Uno per tutti, tutti per uno\" — e quando capita un'incomprensione, si risolve tutto con una birra!<br/><br/>Nessuno pretende di essere il migliore: l'obiettivo è crescere insieme nella qualità del gioco, tra conoscenza delle regole, visione di gioco e capacità di dialogo.<br/><br/>Sei curioso di provare, vuoi conoscere persone nuove o sei appassionato del mondo dei Vampiri? Contatta il Principe: ti aspettiamo per una demo e un'ottima serata in compagnia!",
        en: 'The Domain of Parma is built on three fundamental rules: Fun, Fellowship and Teamwork. The most important thing is to keep smiling and enjoy the game as a fun experience. "All for one, one for all" — and when a misunderstanding arises, we settle it over a beer!<br/><br/>Nobody claims to be the best: the goal is to grow together in game quality, through rules knowledge, game vision and communication skills.<br/><br/>Curious to try, want to meet new people or passionate about the world of Vampires? Contact the Prince: we\'re waiting for you for a demo and a great evening together!',
      },
      image: '/images/comunita/parma/gruppo.webp',
    },
  },
  {
    slug: { it: 'pordenone', en: 'pordenone' },
    name: { it: 'Pordenone', en: 'Pordenone' },
    region: 'Friuli-Venezia Giulia',
    prince: {
      name: 'Danny Buset',
      alias: 'Debby',
      image: '/images/principi/principi-danny-buset.webp',
      email: 'pordenonevtes@gmail.com',
    },
    headerImage: '/images/headers/header-pordenone.webp',
    description: {
      it: 'Ritrovo settimanale alla Fumetteria Safarà il giovedì sera. Community friulana con partite regolari e tornei locali.',
      en: 'Weekly meetup at Fumetteria Safarà on Thursday evenings. Friulian community with regular games and local tournaments.',
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì', en: 'Thursday' },
        time: { it: '20:00', en: '20:00' },
        place: 'Fumetteria Safarà',
        address: 'Via Piave 26, Pordenone (PN)',
        mapUrl: 'https://maps.app.goo.gl/DKhAd6iAneHdVxUh9',
      },
    ],
    tagId: 25,
  },
  {
    slug: { it: 'prato', en: 'prato' },
    name: { it: 'Prato', en: 'Prato' },
    region: 'Toscana',
    prince: {
      name: 'Lorenzo Ferri',
      alias: 'ComedaLore',
      image: '/images/principi/principi-lorenzo-ferri.webp',
      email: 'Vtesfirenze@gmail.com',
    },
    headerImage: '/images/headers/header-prato.webp',
    description: {
      it: 'Dominio toscano con ritrovi settimanali al Magic Maze. Unisciti alla community pratese ogni venerdì!',
      en: 'Tuscan domain with weekly meetups at Magic Maze. Join the Prato community every Friday!',
    },
    meetupSchedule: [
      {
        day: { it: 'Venerdì', en: 'Friday' },
        place: 'Magic Maze',
        address: 'Via Bicchierai Zanobi 42, Prato (PO)',
        mapUrl: 'https://maps.app.goo.gl/dChTSs317JTjiT1y6',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/Fo0kloARBr0B4nvOKm9RVS',
    tagId: 26,
    highlight: {
      title: { it: 'Il Hobra Hai!', en: 'Il Hobra Hai!' },
      text: {
        it: '<em>Bleeda primo. Bleeda sodo. No Archon.</em><br>Nessun Matusalemme è al sicuro quando gli Hobra Hai siedono al tavolo. Che tu sia un neonato o un anziano, a Firenze e Prato c\'è un posto per te — e zero pietà.',
        en: '<em>Bleeda primo. Bleeda sodo. No Archon.</em><br>No Methuselah is safe when the Hobra Hai sit at the table. Whether you are a neonate or an elder, there is a seat for you in Firenze and Prato — and zero mercy.',
      },
      image: '/images/comunita/firenze-prato/hobra-hai.jpeg',
    },
  },
  {
    slug: { it: 'roma', en: 'roma' },
    name: { it: 'Roma', en: 'Roma' },
    region: 'Lazio',
    prince: {
      name: 'Alessandro Spataro',
      alias: 'Loki',
      image: '/images/principi/principi-alessandro-spataro.webp',
      email: 'ale.loki.spataro@gmail.com',
    },
    headerImage: '/images/headers/header-roma.webp',
    description: {
      it: 'Il Principato della Capitale con incontri su richiesta. Contatta il Principe per unirti alla community romana.',
      en: "The Capital's domain with meetups on request. Contact the Prince to join the Roman community.",
    },
    meetupSchedule: [],
    tagId: 27,
  },
  {
    slug: { it: 'torino', en: 'torino' },
    name: { it: 'Torino', en: 'Torino' },
    region: 'Piemonte',
    prince: {
      name: 'Paolo Pasqualin',
      alias: 'Pisqua',
      image: '/images/principi/principi-paolo-pasqualin.webp',
      email: 'wraith70@tiscali.it',
    },
    headerImage: '/images/headers/header-torino.webp',
    description: {
      it: 'Dominio piemontese con incontri flessibili. Contatta il Principe per partite e informazioni sulla community torinese.',
      en: 'Piedmontese domain with flexible meetups. Contact the Prince for games and info about the Turin community.',
    },
    meetupSchedule: [],
    tagId: 28,
  },
  {
    slug: { it: 'trento', en: 'trento' },
    name: { it: 'Trento', en: 'Trento' },
    region: 'Trentino-Alto Adige',
    prince: {
      name: 'Giulio De Cicco',
      alias: 'Black Fox',
      image: '/images/principi/principi-giulio-de-cicco.webp',
      email: 'asgard.aldeno@gmail.com',
    },
    headerImage: '/images/headers/header-trento.webp',
    description: {
      it: "Ritrovi all'Asgard di Aldeno, principalmente il venerdì sera. Community trentina con demo e prestito mazzi per i nuovi arrivati.",
      en: 'Meetups at Asgard in Aldeno, mainly on Friday evenings. Trentino community with demos and deck lending for newcomers.',
    },
    meetupSchedule: [
      {
        day: { it: 'Venerdì', en: 'Friday' },
        time: { it: '20:30–01:00', en: '20:30–01:00' },
        place: 'Asgard Aldeno',
        address: 'Via Roma 3, Aldeno (TN)',
        mapUrl: 'https://maps.app.goo.gl/AchwBLz3fYaFHHVr9',
      },
    ],
    meetupNote: {
      it: 'Giorno deciso con votazione durante la settimana. Demo e prestito mazzi disponibili.',
      en: 'Day decided by vote during the week. Demos and deck lending available.',
    },
    tagId: 29,
  },
  {
    slug: { it: 'treviso', en: 'treviso' },
    name: { it: 'Treviso', en: 'Treviso' },
    region: 'Veneto',
    prince: {
      name: 'Danilo Fruttaldo',
      alias: 'NOPEdanilo',
      image: '/images/principi/principi-danilo-fruttaldo.webp',
      email: 'vtes.treviso@gmail.com',
    },
    headerImage: '/images/headers/header-treviso.webp',
    description: {
      it: 'Partite casual e tornei a Treviso. Sessioni in sede privata durante la settimana ed eventi al GiOlly Comics.',
      en: 'Casual games and tournaments in Treviso. Private venue sessions during the week and events at GiOlly Comics.',
    },
    meetupSchedule: [
      {
        day: { it: 'Lunedì\nGiovedì', en: 'Monday\nThursday' },
        place: 'Sede privata',
      },
      {
        day: { it: 'Eventi', en: 'Events' },
        place: 'GiOlly Comics',
        address: 'Strada dei Biscari 2, Treviso (TV)',
        mapUrl: 'https://maps.app.goo.gl/zhsHyxTxDhTcQeGh6',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EIRaOH8PNlY3M8oUWjzGpO',
    tagId: 30,
  },
  {
    slug: { it: 'verona', en: 'verona' },
    name: { it: 'Verona', en: 'Verona' },
    region: 'Veneto',
    prince: {
      name: 'Nicola Lonardi',
      alias: 'Paffo',
      image: '/images/principi/principi-nicola-lonardi.webp',
      email: 'xeno83@gmail.com',
    },
    headerImage: '/images/headers/header-verona.webp',
    description: {
      it: 'Dominio veneto con incontri flessibili. Contatta il Principe per partite e informazioni sulla community veronese.',
      en: 'Venetian domain with flexible meetups. Contact the Prince for games and info about the Verona community.',
    },
    meetupSchedule: [],
    tagId: 31,
  },
];
