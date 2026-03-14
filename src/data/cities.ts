export interface MeetupEntry {
  day: string;
  dayEn: string;
  time?: string;
  timeEn?: string;
  place: string;
  address?: string;
  mapUrl?: string;
}

export interface City {
  slug: string;
  slugEn: string;
  name: string;
  nameEn: string;
  region: string;
  prince: {
    name: string;
    alias: string;
    image: string;
    email?: string;
  };
  headerImage: string;
  descriptionIt: string;
  descriptionEn: string;
  meetupSchedule: MeetupEntry[];
  meetupNote?: string;
  meetupNoteEn?: string;
  mapUrl?: string;
  whatsappUrl?: string;
  tagId?: number;
  highlight?: {
    title: string;
    titleEn: string;
    text: string;
    textEn: string;
    image?: string;
    link?: string;
  };
}

export const cities: City[] = [
  {
    slug: 'barga',
    slugEn: 'barga',
    name: 'Barga (LU)',
    nameEn: 'Barga (LU)',
    region: 'Toscana',
    prince: { name: 'Alessandro Donati', alias: 'Nekrós', image: '/images/principi/principi-Alessandro-Donati.webp', email: 'adonati1982@gmail.com' },
    headerImage: '/images/headers/header-barga.webp',
    descriptionIt: 'Community attiva nella valle del Serchio con partite settimanali e tornei presso la Garfaludica APS. Un punto di riferimento per i giocatori della Garfagnana e della Toscana nord-occidentale.',
    descriptionEn: 'Active community in the Serchio valley with weekly games and tournaments at Garfaludica APS. A hub for players from Garfagnana and north-western Tuscany.',
    meetupSchedule: [
      {
        day: 'Mercoledì',
        dayEn: 'Wednesday',
        place: 'Garfaludica APS, Tana dei Goblin',
        address: 'Castelnuovo di Garfagnana',
        mapUrl: 'https://maps.google.com/?q=Garfaludica+APS+Castelnuovo+di+Garfagnana',
      },
    ],
    meetupNote: 'Su richiesta, incontri anche sabato e domenica.',
    meetupNoteEn: 'On request, meetups also on Saturday and Sunday.',
    tagId: 18,
  },
  {
    slug: 'bologna',
    slugEn: 'bologna',
    name: 'Bologna',
    nameEn: 'Bologna',
    region: 'Emilia-Romagna',
    prince: { name: 'Federico Ferrarini', alias: 'Rip', image: '/images/principi/principi-Federico-Ferrarini.webp', email: 'fedemail83@gmail.com' },
    headerImage: '/images/headers/header-bologna.webp',
    descriptionIt: 'Ritrovo al Circolo Barbanera con sessioni su più giorni della settimana. Una delle community più longeve dell\'Emilia-Romagna.',
    descriptionEn: 'Meetups at Circolo Barbanera with sessions on multiple days per week. One of the longest-running communities in Emilia-Romagna.',
    meetupSchedule: [
      { day: 'Giovedì\nVenerdì\nSabato', dayEn: 'Thursday\nFriday\nSaturday', place: 'Circolo Barbanera', mapUrl: 'https://maps.google.com/?q=Circolo+Barbanera+Bologna' },
    ],
    tagId: 17,
  },
  {
    slug: 'firenze',
    slugEn: 'firenze',
    name: 'Firenze',
    nameEn: 'Firenze',
    region: 'Toscana',
    prince: { name: 'Leonardo Bensi', alias: 'Mr. Banks', image: '/images/principi/principi-Leonardo-Bensi.webp', email: 'leobensi@gmail.com' },
    headerImage: '/images/headers/header-firenze.webp',
    descriptionIt: 'Principato fiorentino con incontri flessibili nel cuore della Toscana. Contatta il Principe per orari e luoghi di ritrovo.',
    descriptionEn: 'Florentine domain with flexible meetups in the heart of Tuscany. Contact the Prince for times and venues.',
    meetupSchedule: [],
    tagId: 19,
  },
  {
    slug: 'genova',
    slugEn: 'genova',
    name: 'Genova',
    nameEn: 'Genova',
    region: 'Liguria',
    prince: { name: 'Alessandro Aprigliano', alias: 'Fan of Moss', image: '/images/principi/principi-Alessandro-Aprigliano.webp', email: 'alexdottrhino@gmail.com' },
    headerImage: '/images/headers/header-genova.webp',
    descriptionIt: 'Community ligure con incontri su richiesta. Un dominio giovane ma in crescita, aperto a nuovi giocatori.',
    descriptionEn: 'Ligurian community with meetups on request. A young but growing domain, open to new players.',
    meetupSchedule: [],
    tagId: 20,
  },
  {
    slug: 'massa',
    slugEn: 'massa',
    name: 'Massa',
    nameEn: 'Massa',
    region: 'Toscana',
    prince: { name: 'Davide Antoni', alias: 'The Look', image: '/images/principi/principi-Davide-Antoni.webp', email: 'massabynight@gmail.com' },
    headerImage: '/images/headers/header-massa.webp',
    descriptionIt: 'Community apuana con sessioni regolari allo Sporting Club Le Pinete. Punto di riferimento per giocatori tra Massa, Carrara, La Spezia e Viareggio.',
    descriptionEn: 'Apuan community with regular sessions at Sporting Club Le Pinete. A hub for players from Massa, Carrara, La Spezia and Viareggio.',
    meetupSchedule: [
      { day: 'Lunedì\nMercoledì\nVenerdì', dayEn: 'Monday\nWednesday\nFriday', place: 'Associazione Ludica Apuana, Sporting Club Le Pinete', address: 'Via San Ginese 15 (Poveromo), 54100 Massa MS', mapUrl: 'https://maps.google.com/?q=Sporting+Club+Le+Pinete+Via+San+Ginese+15+Poveromo+Massa' },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EPKZ9BlvW5lG8CLQ6KqTV8',
    tagId: 21,
    highlight: {
      title: 'Massa by Night – Comunità VTES',
      titleEn: 'Massa by Night – VTES Community',
      text: 'Sei appassionato di Vampire: the Eternal Struggle o vorresti scoprire questo gioco? Stiamo cercando nuovi giocatori per espandere la community locale! Dai veterani ai neonati che vogliono imparare le regole, se abiti tra Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio e zone limitrofe, sei il benvenuto al tavolo!',
      textEn: 'Are you a fan of Vampire: the Eternal Struggle or would you like to discover this unique card game? We are looking for new players to expand our local community! From veterans to newcomers who want to learn the rules, if you live near Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio and surrounding areas, you are welcome at the table!',
      image: '/images/eventi/massa-by-night.webp',
    },
  },
  {
    slug: 'milano',
    slugEn: 'milano',
    name: 'Milano',
    nameEn: 'Milano',
    region: 'Lombardia',
    prince: { name: 'Massimo Vaccari', alias: 'Gandalf78', image: '/images/principi/principi-Massimo-Vaccari.webp', email: 'vtesmilano2019@gmail.com' },
    headerImage: '/images/headers/header-milano.webp',
    descriptionIt: 'Uno dei principati più attivi d\'Italia, con ritrovi settimanali alla Casa dei Giochi. Community accogliente con prestito mazzi per i nuovi giocatori.',
    descriptionEn: 'One of Italy\'s most active domains, with weekly meetups at Casa dei Giochi. Welcoming community with deck lending for new players.',
    meetupSchedule: [
      {
        day: 'Giovedì',
        dayEn: 'Thursday',
        place: 'Casa dei Giochi',
        address: 'Via Sant\'Uguzzone, Milano',
        mapUrl: 'https://maps.google.com/?q=Casa+dei+Giochi+Via+Sant+Uguzzone+Milano',
      },
    ],
    meetupNote: 'Altri giorni in base alla partecipazione.',
    meetupNoteEn: 'Other days depending on attendance.',
    whatsappUrl: 'https://chat.whatsapp.com/L15bwtkJQYx6OHceA7pLeW',
    tagId: 22,
    highlight: {
      title: 'Nuovo giocatore? Impara a giocare con noi!',
      titleEn: 'New player? Learn to play with us!',
      text: 'Sei un nuovo giocatore? Hai voglia di provare questo fantastico gioco? O semplicemente sei un vecchio giocatore a cui è tornata la voglia di bleedare? Contattaci: troverai la Community di Milano e dintorni (anche Bergamo) pronta ad accoglierti. Carte e segnalini sangue in omaggio per il tuo primo mazzo!',
      textEn: 'Are you a new player? Want to try this fantastic game? Or simply a veteran who got the urge to bleed again? Contact us: the Milano community (including Bergamo) is ready to welcome you. Free cards and blood counters for your first deck!',
      image: '/images/eventi/nuovo-giocatore-milano.webp',
    },
  },
  {
    slug: 'modena',
    slugEn: 'modena',
    name: 'Modena',
    nameEn: 'Modena',
    region: 'Emilia-Romagna',
    prince: { name: 'Simone Parmeggiani', alias: 'Parmeg', image: '/images/principi/principi-Simone-Parmeggiani.webp', email: 'parmeggiani.simone@gmail.com' },
    headerImage: '/images/headers/header-modena.webp',
    descriptionIt: 'Sessioni serali all\'Alearum Mundus di Spilamberto e incontri occasionali alla Mutina Bellica. Community emiliana in espansione.',
    descriptionEn: 'Evening sessions at Alearum Mundus in Spilamberto and occasional meetups at Mutina Bellica. A growing Emilian community.',
    meetupSchedule: [
      {
        day: 'Giovedì',
        dayEn: 'Thursday',
        time: 'Orario serale',
        timeEn: 'Evening',
        place: 'Alearum Mundus',
        address: 'Via Castelnuovo R. 796, 41057 Spilamberto MO',
        mapUrl: 'https://maps.google.com/?q=Alearum+Mundus+Via+Castelnuovo+Rangone+796+Spilamberto',
      },
      {
        day: 'Occasionalmente',
        dayEn: 'Occasionally',
        place: 'Mutina Bellica, c/o Polisportiva Sacca',
        address: 'Via Alfonso Paltrinieri 80, 41122 Modena MO',
        mapUrl: 'https://maps.google.com/?q=Polisportiva+Sacca+Via+Alfonso+Paltrinieri+80+Modena',
      },
    ],
    tagId: 23,
  },
  {
    slug: 'parma',
    slugEn: 'parma',
    name: 'Parma',
    nameEn: 'Parma',
    region: 'Emilia-Romagna',
    prince: { name: 'Leonardo Magri', alias: 'Kaiser', image: '/images/principi/principi-Leonardo-Magri.webp', email: 'leonardo.magri13@gmail.com' },
    headerImage: '/images/headers/header-parma.webp',
    descriptionIt: 'Dominio emiliano con incontri su richiesta. Contatta il Principe per organizzare partite e conoscere la community locale.',
    descriptionEn: 'Emilian domain with meetups on request. Contact the Prince to arrange games and meet the local community.',
    meetupSchedule: [],
    tagId: 24,
  },
  {
    slug: 'pordenone',
    slugEn: 'pordenone',
    name: 'Pordenone',
    nameEn: 'Pordenone',
    region: 'Friuli-Venezia Giulia',
    prince: { name: 'Danny Buset', alias: 'Debby', image: '/images/principi/principi-Danny-Buset.webp', email: 'pordenonevtes@gmail.com' },
    headerImage: '/images/headers/header-pordenone.webp',
    descriptionIt: 'Ritrovo settimanale alla Fumetteria Safarà il giovedì sera. Community friulana con partite regolari e tornei locali.',
    descriptionEn: 'Weekly meetup at Fumetteria Safarà on Thursday evenings. Friulian community with regular games and local tournaments.',
    meetupSchedule: [
      {
        day: 'Giovedì',
        dayEn: 'Thursday',
        time: '20:00',
        place: 'Fumetteria Safarà',
        address: 'Via Piave 26, Pordenone (PN)',
        mapUrl: 'https://maps.google.com/?q=Fumetteria+Safar%C3%A0+Via+Piave+26+Pordenone',
      },
    ],
    tagId: 25,
  },
  {
    slug: 'prato',
    slugEn: 'prato',
    name: 'Prato',
    nameEn: 'Prato',
    region: 'Toscana',
    prince: { name: 'Lorenzo Ferri', alias: 'ComedaLore', image: '/images/principi/principi-Lorenzo-Ferri.webp', email: 'lorenzoferri82@gmail.com' },
    headerImage: '/images/headers/header-prato.webp',
    descriptionIt: 'Dominio toscano con incontri flessibili. Contatta il Principe per scoprire orari e luoghi di gioco nella zona pratese.',
    descriptionEn: 'Tuscan domain with flexible meetups. Contact the Prince for game times and venues in the Prato area.',
    meetupSchedule: [],
    tagId: 26,
  },
  {
    slug: 'roma',
    slugEn: 'roma',
    name: 'Roma',
    nameEn: 'Roma',
    region: 'Lazio',
    prince: { name: 'Alessandro Spataro', alias: 'Loki', image: '/images/principi/principi-Alessandro-Spataro.webp', email: 'ale.loki.spataro@gmail.com' },
    headerImage: '/images/headers/header-roma.webp',
    descriptionIt: 'Il Principato della Capitale con incontri su richiesta. Contatta il Principe per unirti alla community romana.',
    descriptionEn: 'The Capital\'s domain with meetups on request. Contact the Prince to join the Roman community.',
    meetupSchedule: [],
    tagId: 27,
  },
  {
    slug: 'torino',
    slugEn: 'torino',
    name: 'Torino',
    nameEn: 'Torino',
    region: 'Piemonte',
    prince: { name: 'Paolo Pasqualin', alias: 'Pisqua', image: '/images/principi/principi-Paolo-Pasqualin.webp', email: 'wraith70@tiscali.it' },
    headerImage: '/images/headers/header-torino.webp',
    descriptionIt: 'Dominio piemontese con incontri flessibili. Contatta il Principe per partite e informazioni sulla community torinese.',
    descriptionEn: 'Piedmontese domain with flexible meetups. Contact the Prince for games and info about the Turin community.',
    meetupSchedule: [],
    tagId: 28,
  },
  {
    slug: 'trento',
    slugEn: 'trento',
    name: 'Trento',
    nameEn: 'Trento',
    region: 'Trentino-Alto Adige',
    prince: { name: 'Giulio De Cicco', alias: 'Black Fox', image: '/images/principi/principi-Giulio-De-Cicco.webp', email: 'asgard.aldeno@gmail.com' },
    headerImage: '/images/headers/header-trento.webp',
    descriptionIt: 'Ritrovi all\'Asgard di Aldeno, principalmente il venerdì sera. Community trentina con demo e prestito mazzi per i nuovi arrivati.',
    descriptionEn: 'Meetups at Asgard in Aldeno, mainly on Friday evenings. Trentino community with demos and deck lending for newcomers.',
    meetupSchedule: [
      {
        day: 'Venerdì (principalmente)',
        dayEn: 'Friday (mainly)',
        time: '20:30–01:00',
        place: 'Asgard Aldeno',
        address: 'Via Roma 1, Aldeno (TN)',
        mapUrl: 'https://maps.google.com/?q=Asgard+Aldeno+Via+Roma+1+Aldeno+TN',
      },
    ],
    meetupNote: 'Giorno deciso con votazione durante la settimana. Demo e prestito mazzi disponibili.',
    meetupNoteEn: 'Day decided by vote during the week. Demos and deck lending available.',
    tagId: 29,
  },
  {
    slug: 'treviso',
    slugEn: 'treviso',
    name: 'Treviso',
    nameEn: 'Treviso',
    region: 'Veneto',
    prince: { name: 'Danilo Fruttaldo', alias: 'NOPEdanilo', image: '/images/principi/principi-Danilo-Fruttaldo.webp', email: 'vtes.treviso@gmail.com' },
    headerImage: '/images/headers/header-treviso.webp',
    descriptionIt: 'Partite casual e tornei a Treviso. Sessioni in sede privata durante la settimana ed eventi al GiOlly Comics.',
    descriptionEn: 'Casual games and tournaments in Treviso. Private venue sessions during the week and events at GiOlly Comics.',
    meetupSchedule: [
      {
        day: 'Lunedì\nGiovedì',
        dayEn: 'Monday\nThursday',
        place: 'Sede privata',
      },
      {
        day: 'Eventi',
        dayEn: 'Events',
        place: 'GiOlly Comics',
        mapUrl: 'https://maps.google.com/?q=GiOlly+Comics+Treviso',
      },
    ],
    whatsappUrl: 'https://chat.whatsapp.com/EIRaOH8PNlY3M8oUWjzGpO',
    tagId: 30,
  },
  {
    slug: 'verona',
    slugEn: 'verona',
    name: 'Verona',
    nameEn: 'Verona',
    region: 'Veneto',
    prince: { name: 'Nicola Lonardi', alias: 'Paffo', image: '/images/principi/principi-Nicola-Lonardi.webp', email: 'xeno83@gmail.com' },
    headerImage: '/images/headers/header-verona.webp',
    descriptionIt: 'Dominio veneto con incontri flessibili. Contatta il Principe per partite e informazioni sulla community veronese.',
    descriptionEn: 'Venetian domain with flexible meetups. Contact the Prince for games and info about the Verona community.',
    meetupSchedule: [],
    tagId: 31,
  },
];
