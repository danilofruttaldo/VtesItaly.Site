export interface MeetupEntry {
  day: string;
  dayEn: string;
  time?: string;
  place: string;
  address?: string;
  mapUrl: string;
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
  };
  headerImage: string;
  descriptionIt: string;
  descriptionEn: string;
  meetupSchedule: MeetupEntry[];
  meetupNote?: string;
  meetupNoteEn?: string;
  mapUrl?: string;
  tagId?: number;
  highlight?: {
    title: string;
    titleEn: string;
    text: string;
    textEn: string;
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
    prince: { name: 'Alessandro Donati', alias: 'Nekrós', image: '/images/principi/Principi-Alessandro-Donati.webp' },
    headerImage: '/images/headers/header-barga.webp',
    descriptionIt: 'Partite settimanali e tornei nella valle del Serchio.',
    descriptionEn: 'Weekly games and tournaments in the Serchio valley.',
    meetupSchedule: [
      {
        day: 'Mercoledì',
        dayEn: 'Wednesday',
        place: 'Garfaludica APS — Tana dei Goblin',
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
    prince: { name: 'Federico Ferrarini', alias: 'Rip', image: '/images/principi/Principi-Federico-Ferrarini.webp' },
    headerImage: '/images/headers/header-bologna.webp',
    descriptionIt: 'Partite al circolo Barbanera.',
    descriptionEn: 'Games at circolo Barbanera.',
    meetupSchedule: [
      {
        day: 'Giovedì, venerdì e sabato',
        dayEn: 'Thursday, Friday and Saturday',
        place: 'Circolo Barbanera',
        mapUrl: 'https://maps.google.com/?q=Circolo+Barbanera+Bologna',
      },
    ],
    tagId: 17,
  },
  {
    slug: 'firenze',
    slugEn: 'firenze',
    name: 'Firenze',
    nameEn: 'Firenze',
    region: 'Toscana',
    prince: { name: 'Leonardo Bensi', alias: 'Mr. Banks', image: '/images/principi/Principi-Leonardo-Bensi.webp' },
    headerImage: '/images/headers/header-firenze.webp',
    descriptionIt: 'Partite settimanali a Firenze.',
    descriptionEn: 'Weekly games in Florence.',
    meetupSchedule: [],
    tagId: 19,
  },
  {
    slug: 'genova',
    slugEn: 'genova',
    name: 'Genova',
    nameEn: 'Genova',
    region: 'Liguria',
    prince: { name: 'Alessandro Aprigliano', alias: 'Fan of Moss', image: '/images/principi/Principi-Alessandro-Aprigliano.webp' },
    headerImage: '/images/headers/header-genova.webp',
    descriptionIt: 'Incontri flessibili a Genova.',
    descriptionEn: 'Flexible meetups in Genova.',
    meetupSchedule: [],
    tagId: 20,
  },
  {
    slug: 'massa',
    slugEn: 'massa',
    name: 'Massa',
    nameEn: 'Massa',
    region: 'Toscana',
    prince: { name: 'Davide Antoni', alias: 'The Look', image: '/images/principi/Principi-Davide-Antoni.webp' },
    headerImage: '/images/headers/header-massa.webp',
    descriptionIt: 'Partite a Massa.',
    descriptionEn: 'Games in Massa.',
    meetupSchedule: [
      {
        day: 'Lunedì, mercoledì e venerdì',
        dayEn: 'Monday, Wednesday and Friday',
        place: 'Associazione Ludica Apuana — Sporting Club Le Pinete',
        address: 'Via San Ginese 15 (Poveromo), 54100 Massa MS',
        mapUrl: 'https://maps.google.com/?q=Sporting+Club+Le+Pinete+Via+San+Ginese+15+Poveromo+Massa',
      },
    ],
    tagId: 21,
    highlight: {
      title: 'Massa by Night – Comunità VTES',
      titleEn: 'Massa by Night – VTES Community',
      text: 'Sei appassionato di Vampire: the Eternal Struggle o vorresti scoprire questo gioco? Stiamo cercando nuovi giocatori per espandere la community locale! Dai veterani ai neonati che vogliono imparare le regole, se abiti tra Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio e zone limitrofe, sei il benvenuto al tavolo!',
      textEn: 'Are you a fan of Vampire: the Eternal Struggle or would you like to discover this unique card game? We are looking for new players to expand our local community! From veterans to newcomers who want to learn the rules, if you live near Massa, Carrara, Montignoso, La Spezia, Sarzana, Viareggio and surrounding areas, you are welcome at the table!',
    },
  },
  {
    slug: 'milano',
    slugEn: 'milano',
    name: 'Milano',
    nameEn: 'Milano',
    region: 'Lombardia',
    prince: { name: 'Massimo Vaccari', alias: 'Gandalf78', image: '/images/principi/Principi-Massimo-Vaccari.webp' },
    headerImage: '/images/headers/header-milano.webp',
    descriptionIt: 'Partite settimanali a Milano.',
    descriptionEn: 'Weekly games in Milan.',
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
    tagId: 22,
    highlight: {
      title: 'Nuovo giocatore? Impara a giocare con noi!',
      titleEn: 'New player? Learn to play with us!',
      text: 'Sei un nuovo giocatore? Hai voglia di provare questo fantastico gioco? O semplicemente sei un vecchio giocatore a cui è tornata la voglia di bleedare? Contattaci: troverai la Community di Milano e dintorni (anche Bergamo) pronta ad accoglierti. Carte e segnalini sangue in omaggio per il tuo primo mazzo!',
      textEn: 'Are you a new player? Want to try this fantastic game? Or simply a veteran who got the urge to bleed again? Contact us: the Milano community (including Bergamo) is ready to welcome you. Free cards and blood counters for your first deck!',
    },
  },
  {
    slug: 'modena',
    slugEn: 'modena',
    name: 'Modena',
    nameEn: 'Modena',
    region: 'Emilia-Romagna',
    prince: { name: 'Simone Parmeggiani', alias: 'Parmeg', image: '/images/principi/Principi-Simone-Parmeggiani.webp' },
    headerImage: '/images/headers/header-modena.webp',
    descriptionIt: 'Partite a Modena.',
    descriptionEn: 'Games in Modena.',
    meetupSchedule: [
      {
        day: 'Giovedì sera',
        dayEn: 'Thursday evening',
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
    prince: { name: 'Leonardo Magri', alias: 'Kaiser', image: '/images/principi/Principi-Leonardo-Magri.webp' },
    headerImage: '/images/headers/header-parma.webp',
    descriptionIt: 'Incontri flessibili a Parma.',
    descriptionEn: 'Flexible meetups in Parma.',
    meetupSchedule: [],
    tagId: 24,
  },
  {
    slug: 'pordenone',
    slugEn: 'pordenone',
    name: 'Pordenone',
    nameEn: 'Pordenone',
    region: 'Friuli-Venezia Giulia',
    prince: { name: 'Danny Buset', alias: 'Debby', image: '/images/principi/Principi-Danny-Buset.webp' },
    headerImage: '/images/headers/header-pordenone.webp',
    descriptionIt: 'Partite a Pordenone.',
    descriptionEn: 'Games in Pordenone.',
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
    prince: { name: 'Lorenzo Ferri', alias: 'ComedaLore', image: '/images/principi/Principi-Lorenzo-Ferri.webp' },
    headerImage: '/images/headers/header-prato.webp',
    descriptionIt: 'Incontri flessibili a Prato.',
    descriptionEn: 'Flexible meetups in Prato.',
    meetupSchedule: [],
    tagId: 26,
  },
  {
    slug: 'roma',
    slugEn: 'roma',
    name: 'Roma',
    nameEn: 'Roma',
    region: 'Lazio',
    prince: { name: 'Alessandro Spataro', alias: 'Loki', image: '/images/principi/Principi-Alessandro-Spataro.webp' },
    headerImage: '/images/headers/header-roma.webp',
    descriptionIt: 'Incontri flessibili a Roma.',
    descriptionEn: 'Flexible meetups in Roma.',
    meetupSchedule: [],
    tagId: 27,
  },
  {
    slug: 'torino',
    slugEn: 'torino',
    name: 'Torino',
    nameEn: 'Torino',
    region: 'Piemonte',
    prince: { name: 'Paolo Pasqualin', alias: 'Pisqua', image: '/images/principi/Principi-Paolo-Pasqualin.webp' },
    headerImage: '/images/headers/header-torino.webp',
    descriptionIt: 'Incontri flessibili a Torino.',
    descriptionEn: 'Flexible meetups in Torino.',
    meetupSchedule: [],
    tagId: 28,
  },
  {
    slug: 'trento',
    slugEn: 'trento',
    name: 'Trento',
    nameEn: 'Trento',
    region: 'Trentino-Alto Adige',
    prince: { name: 'Giulio De Cicco', alias: 'Black Fox', image: '/images/principi/Principi-Giulio-De-Cicco.webp' },
    headerImage: '/images/headers/header-trento.webp',
    descriptionIt: 'Partite a Trento.',
    descriptionEn: 'Games in Trento.',
    meetupSchedule: [
      {
        day: 'Flessibile (di solito venerdì)',
        dayEn: 'Flexible (usually Friday)',
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
    prince: { name: 'Danilo Fruttaldo', alias: 'NOPEdanilo', image: '/images/principi/Principi-Danilo-Fruttaldo.webp' },
    headerImage: '/images/headers/header-treviso.webp',
    descriptionIt: 'Gioco casual e tornei a Treviso.',
    descriptionEn: 'Casual play and tournaments in Treviso.',
    meetupSchedule: [
      {
        day: 'Flessibile',
        dayEn: 'Flexible',
        place: 'GiOlly Comics (tornei ed eventi)',
        mapUrl: 'https://maps.google.com/?q=GiOlly+Comics+Treviso',
      },
    ],
    meetupNote: 'Gioco casual settimanale in giorno variabile, in base alla partecipazione.',
    meetupNoteEn: 'Weekly casual play on a flexible day, based on attendance.',
    tagId: 30,
  },
  {
    slug: 'verona',
    slugEn: 'verona',
    name: 'Verona',
    nameEn: 'Verona',
    region: 'Veneto',
    prince: { name: 'Nicola Lonardi', alias: 'Paffo', image: '/images/principi/Principi-Nicola-Lonardi.webp' },
    headerImage: '/images/headers/header-verona.webp',
    descriptionIt: 'Incontri flessibili a Verona.',
    descriptionEn: 'Flexible meetups in Verona.',
    meetupSchedule: [],
    tagId: 31,
  },
];
