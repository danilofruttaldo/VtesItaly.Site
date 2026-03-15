import type { Locale } from '../utils/i18n';

export interface MeetupEntry {
  day: Record<Locale, string>;
  time?: Record<Locale, string>;
  place: string;
  address?: string;
  mapUrl?: string;
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
    prince: { name: 'Alessandro Donati', alias: 'Nekrós', image: '/images/principi/principi-alessandro-donati.webp', email: 'adonati1982@gmail.com' },
    headerImage: '/images/headers/header-barga.webp',
    description: {
      it: 'Community attiva nella valle del Serchio con partite settimanali e tornei presso la Garfaludica APS. Un punto di riferimento per i giocatori della Garfagnana e della Toscana nord-occidentale.',
      en: 'Active community in the Serchio valley with weekly games and tournaments at Garfaludica APS. A hub for players from Garfagnana and north-western Tuscany.',
    },
    meetupSchedule: [
      {
        day: { it: 'Mercoledì', en: 'Wednesday' },
        place: 'Garfaludica APS, Tana dei Goblin',
        address: 'Castelnuovo di Garfagnana',
        mapUrl: 'https://maps.google.com/?q=Garfaludica+APS+Castelnuovo+di+Garfagnana',
      },
    ],
    meetupNote: { it: 'Su richiesta, incontri anche sabato e domenica.', en: 'On request, meetups also on Saturday and Sunday.' },
    tagId: 18,
  },
  {
    slug: { it: 'bologna', en: 'bologna' },
    name: { it: 'Bologna', en: 'Bologna' },
    region: 'Emilia-Romagna',
    prince: { name: 'Federico Ferrarini', alias: 'Rip', image: '/images/principi/principi-federico-ferrarini.webp', email: 'fedemail83@gmail.com' },
    headerImage: '/images/headers/header-bologna.webp',
    description: {
      it: 'Ritrovo al Circolo Barbanera con sessioni su più giorni della settimana. Una delle community più longeve dell\'Emilia-Romagna.',
      en: 'Meetups at Circolo Barbanera with sessions on multiple days per week. One of the longest-running communities in Emilia-Romagna.',
    },
    meetupSchedule: [
      { day: { it: 'Giovedì\nVenerdì\nSabato', en: 'Thursday\nFriday\nSaturday' }, place: 'Circolo Barbanera', mapUrl: 'https://maps.google.com/?q=Circolo+Barbanera+Bologna' },
    ],
    tagId: 17,
  },
  {
    slug: { it: 'firenze', en: 'firenze' },
    name: { it: 'Firenze', en: 'Firenze' },
    region: 'Toscana',
    prince: { name: 'Leonardo Bensi', alias: 'Mr. Banks', image: '/images/principi/principi-leonardo-bensi.webp', email: 'leobensi@gmail.com' },
    headerImage: '/images/headers/header-firenze.webp',
    description: {
      it: 'Principato fiorentino con incontri flessibili nel cuore della Toscana. Contatta il Principe per orari e luoghi di ritrovo.',
      en: 'Florentine domain with flexible meetups in the heart of Tuscany. Contact the Prince for times and venues.',
    },
    meetupSchedule: [],
    tagId: 19,
  },
  {
    slug: { it: 'genova', en: 'genova' },
    name: { it: 'Genova', en: 'Genova' },
    region: 'Liguria',
    prince: { name: 'Alessandro Aprigliano', alias: 'Fan of Moss', image: '/images/principi/principi-alessandro-aprigliano.webp', email: 'alexdottrhino@gmail.com' },
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
    prince: { name: 'Davide Antoni', alias: 'The Look', image: '/images/principi/principi-davide-antoni.webp', email: 'massabynight@gmail.com' },
    headerImage: '/images/headers/header-massa.webp',
    description: {
      it: 'Community apuana con sessioni regolari allo Sporting Club Le Pinete. Punto di riferimento per giocatori tra Massa, Carrara, La Spezia e Viareggio.',
      en: 'Apuan community with regular sessions at Sporting Club Le Pinete. A hub for players from Massa, Carrara, La Spezia and Viareggio.',
    },
    meetupSchedule: [
      { day: { it: 'Lunedì\nMercoledì\nVenerdì', en: 'Monday\nWednesday\nFriday' }, place: 'Associazione Ludica Apuana, Sporting Club Le Pinete', address: 'Via San Ginese 15 (Poveromo), 54100 Massa MS', mapUrl: 'https://maps.google.com/?q=Sporting+Club+Le+Pinete+Via+San+Ginese+15+Poveromo+Massa' },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EPKZ9BlvW5lG8CLQ6KqTV8',
    tagId: 21,
    highlight: {
      title: { it: 'Massa by Night – Comunità VTES', en: 'Massa by Night – VTES Community' },
      text: {
        it: 'Sei appassionato di Vampire: the Eternal Struggle o vorresti scoprire questo gioco? Stiamo cercando nuovi giocatori per espandere la community locale! Dai veterani ai neonati che vogliono imparare le regole, se abiti tra Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio e zone limitrofe, sei il benvenuto al tavolo!',
        en: 'Are you a fan of Vampire: the Eternal Struggle or would you like to discover this unique card game? We are looking for new players to expand our local community! From veterans to newcomers who want to learn the rules, if you live near Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio and surrounding areas, you are welcome at the table!',
      },
      image: '/images/eventi/massa-by-night.webp',
    },
  },
  {
    slug: { it: 'milano', en: 'milano' },
    name: { it: 'Milano', en: 'Milano' },
    region: 'Lombardia',
    prince: { name: 'Henry Hinde', alias: 'Acca', image: '/images/principi/principi-henry-hinde.webp', email: 'vtesmilano2019@gmail.com' },
    headerImage: '/images/headers/header-milano.webp',
    description: {
      it: 'Uno dei principati più attivi d\'Italia, con ritrovi settimanali alla Casa dei Giochi. Community accogliente con prestito mazzi per i nuovi giocatori.',
      en: 'One of Italy\'s most active domains, with weekly meetups at Casa dei Giochi. Welcoming community with deck lending for new players.',
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì', en: 'Thursday' },
        place: 'Casa dei Giochi',
        address: 'Via Sant\'Uguzzone, Milano',
        mapUrl: 'https://maps.google.com/?q=Casa+dei+Giochi+Via+Sant+Uguzzone+Milano',
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
      image: '/images/eventi/nuovo-giocatore-milano.webp',
    },
  },
  {
    slug: { it: 'modena', en: 'modena' },
    name: { it: 'Modena', en: 'Modena' },
    region: 'Emilia-Romagna',
    prince: { name: 'Simone Parmeggiani', alias: 'Parmeg', image: '/images/principi/principi-simone-parmeggiani.webp', email: 'parmeggiani.simone@gmail.com' },
    headerImage: '/images/headers/header-modena.webp',
    description: {
      it: 'Sessioni serali all\'Alearum Mundus di Spilamberto e incontri occasionali alla Mutina Bellica. Community emiliana in espansione.',
      en: 'Evening sessions at Alearum Mundus in Spilamberto and occasional meetups at Mutina Bellica. A growing Emilian community.',
    },
    meetupSchedule: [
      {
        day: { it: 'Giovedì', en: 'Thursday' },
        time: { it: 'Orario serale', en: 'Evening' },
        place: 'Alearum Mundus',
        address: 'Via Castelnuovo R. 796, 41057 Spilamberto MO',
        mapUrl: 'https://maps.google.com/?q=Alearum+Mundus+Via+Castelnuovo+Rangone+796+Spilamberto',
      },
      {
        day: { it: 'Occasionalmente', en: 'Occasionally' },
        place: 'Mutina Bellica, c/o Polisportiva Sacca',
        address: 'Via Alfonso Paltrinieri 80, 41122 Modena MO',
        mapUrl: 'https://maps.google.com/?q=Polisportiva+Sacca+Via+Alfonso+Paltrinieri+80+Modena',
      },
    ],
    tagId: 23,
  },
  {
    slug: { it: 'parma', en: 'parma' },
    name: { it: 'Parma', en: 'Parma' },
    region: 'Emilia-Romagna',
    prince: { name: 'Leonardo Magri', alias: 'Kaiser', image: '/images/principi/principi-leonardo-magri.webp', email: 'leonardo.magri13@gmail.com' },
    headerImage: '/images/headers/header-parma.webp',
    description: {
      it: 'Dominio emiliano con incontri su richiesta. Contatta il Principe per organizzare partite e conoscere la community locale.',
      en: 'Emilian domain with meetups on request. Contact the Prince to arrange games and meet the local community.',
    },
    meetupSchedule: [],
    tagId: 24,
  },
  {
    slug: { it: 'pordenone', en: 'pordenone' },
    name: { it: 'Pordenone', en: 'Pordenone' },
    region: 'Friuli-Venezia Giulia',
    prince: { name: 'Danny Buset', alias: 'Debby', image: '/images/principi/principi-danny-buset.webp', email: 'pordenonevtes@gmail.com' },
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
        mapUrl: 'https://maps.google.com/?q=Fumetteria+Safar%C3%A0+Via+Piave+26+Pordenone',
      },
    ],
    tagId: 25,
  },
  {
    slug: { it: 'prato', en: 'prato' },
    name: { it: 'Prato', en: 'Prato' },
    region: 'Toscana',
    prince: { name: 'Lorenzo Ferri', alias: 'ComedaLore', image: '/images/principi/principi-lorenzo-ferri.webp', email: 'lorenzoferri82@gmail.com' },
    headerImage: '/images/headers/header-prato.webp',
    description: {
      it: 'Dominio toscano con incontri flessibili. Contatta il Principe per scoprire orari e luoghi di gioco nella zona pratese.',
      en: 'Tuscan domain with flexible meetups. Contact the Prince for game times and venues in the Prato area.',
    },
    meetupSchedule: [],
    tagId: 26,
  },
  {
    slug: { it: 'roma', en: 'roma' },
    name: { it: 'Roma', en: 'Roma' },
    region: 'Lazio',
    prince: { name: 'Alessandro Spataro', alias: 'Loki', image: '/images/principi/principi-alessandro-spataro.webp', email: 'ale.loki.spataro@gmail.com' },
    headerImage: '/images/headers/header-roma.webp',
    description: {
      it: 'Il Principato della Capitale con incontri su richiesta. Contatta il Principe per unirti alla community romana.',
      en: 'The Capital\'s domain with meetups on request. Contact the Prince to join the Roman community.',
    },
    meetupSchedule: [],
    tagId: 27,
  },
  {
    slug: { it: 'torino', en: 'torino' },
    name: { it: 'Torino', en: 'Torino' },
    region: 'Piemonte',
    prince: { name: 'Paolo Pasqualin', alias: 'Pisqua', image: '/images/principi/principi-paolo-pasqualin.webp', email: 'wraith70@tiscali.it' },
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
    prince: { name: 'Giulio De Cicco', alias: 'Black Fox', image: '/images/principi/principi-giulio-de-cicco.webp', email: 'asgard.aldeno@gmail.com' },
    headerImage: '/images/headers/header-trento.webp',
    description: {
      it: 'Ritrovi all\'Asgard di Aldeno, principalmente il venerdì sera. Community trentina con demo e prestito mazzi per i nuovi arrivati.',
      en: 'Meetups at Asgard in Aldeno, mainly on Friday evenings. Trentino community with demos and deck lending for newcomers.',
    },
    meetupSchedule: [
      {
        day: { it: 'Venerdì (principalmente)', en: 'Friday (mainly)' },
        time: { it: '20:30–01:00', en: '20:30–01:00' },
        place: 'Asgard Aldeno',
        address: 'Via Roma 1, Aldeno (TN)',
        mapUrl: 'https://maps.google.com/?q=Asgard+Aldeno+Via+Roma+1+Aldeno+TN',
      },
    ],
    meetupNote: { it: 'Giorno deciso con votazione durante la settimana. Demo e prestito mazzi disponibili.', en: 'Day decided by vote during the week. Demos and deck lending available.' },
    tagId: 29,
  },
  {
    slug: { it: 'treviso', en: 'treviso' },
    name: { it: 'Treviso', en: 'Treviso' },
    region: 'Veneto',
    prince: { name: 'Danilo Fruttaldo', alias: 'NOPEdanilo', image: '/images/principi/principi-danilo-fruttaldo.webp', email: 'vtes.treviso@gmail.com' },
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
        mapUrl: 'https://maps.google.com/?q=GiOlly+Comics+Treviso',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EIRaOH8PNlY3M8oUWjzGpO',
    tagId: 30,
  },
  {
    slug: { it: 'verona', en: 'verona' },
    name: { it: 'Verona', en: 'Verona' },
    region: 'Veneto',
    prince: { name: 'Nicola Lonardi', alias: 'Paffo', image: '/images/principi/principi-nicola-lonardi.webp', email: 'xeno83@gmail.com' },
    headerImage: '/images/headers/header-verona.webp',
    description: {
      it: 'Dominio veneto con incontri flessibili. Contatta il Principe per partite e informazioni sulla community veronese.',
      en: 'Venetian domain with flexible meetups. Contact the Prince for games and info about the Verona community.',
    },
    meetupSchedule: [],
    tagId: 31,
  },
];
