export interface PostcardGallery {
  title: { it: string; en: string };
  subtitle: { it: string; en: string };
  images: { src: string; alt: string }[];
}

export const postcardGalleries: PostcardGallery[] = [
  {
    title: { it: 'Nazionale 2026', en: 'National Championship 2026' },
    subtitle: { it: 'Trento, Febbraio 2026', en: 'Trento, February 2026' },
    images: [
      { src: '/images/carte/library-brothers-grimm.webp', alt: 'Brothers Grimm' },
      { src: '/images/carte/library-derange.webp', alt: 'Derange' },
      { src: '/images/carte/library-guard-dogs.webp', alt: 'Guard Dogs' },
      { src: '/images/carte/library-concert-tour.webp', alt: 'Concert Tour' },
    ],
  },
  {
    title: { it: 'Week of Sabbat', en: 'Week of Sabbat' },
    subtitle: { it: 'Italia, Ottobre 2025', en: 'Italy, October 2025' },
    images: [
      { src: '/images/carte/crypt-crossbreaker.webp', alt: 'Crossbreaker' },
      { src: '/images/carte/library-dia-de-los-muertos.webp', alt: 'Dia de los Muertos' },
      { src: '/images/carte/library-fiorella-empty-one.webp', alt: 'Fiorella, Empty One' },
    ],
  },
  {
    title: { it: 'Iubilaeum Sabbaticum', en: 'Iubilaeum Sabbaticum' },
    subtitle: { it: 'Roma, Ottobre 2025', en: 'Roma, October 2025' },
    images: [
      { src: '/images/carte/library-on-the-qui-vive.webp', alt: 'On the Qui Vive' },
      { src: '/images/carte/library-organized-resistance.webp', alt: 'Organized Resistance' },
    ],
  },
  {
    title: { it: 'Symposium Italicum MMXXV', en: 'Symposium Italicum MMXXV' },
    subtitle: { it: 'Barga, Agosto 2025', en: 'Barga, August 2025' },
    images: [
      { src: '/images/carte/library-canine-horde.webp', alt: 'Canine Horde' },
      { src: '/images/carte/library-coordinate-attacks.webp', alt: 'Coordinate Attacks' },
      { src: '/images/carte/library-pack-alpha.webp', alt: 'Pack Alpha' },
      { src: '/images/carte/library-hidden-lurker.webp', alt: 'Hidden Lurker' },
    ],
  },
  {
    title: { it: 'Concilio di Pergine', en: 'Concilio di Pergine' },
    subtitle: { it: 'Trento, Giugno 2025', en: 'Trento, June 2025' },
    images: [
      { src: '/images/carte/crypt-anneke.webp', alt: 'Anneke' },
      { src: '/images/carte/library-filchware-pawn-shop.webp', alt: 'Filchware Pawn Shop' },
      { src: '/images/carte/crypt-danylo.webp', alt: 'Danylo' },
      { src: '/images/carte/crypt-gavrylo.webp', alt: 'Gavrylo' },
      { src: '/images/carte/crypt-kyrylo.webp', alt: 'Kyrylo' },
      { src: '/images/carte/crypt-pavlo.webp', alt: 'Pavlo' },
      { src: '/images/carte/crypt-volo.webp', alt: 'Volo' },
      { src: '/images/carte/crypt-angelo.webp', alt: 'Angelo' },
    ],
  },
  {
    title: { it: 'Truth in Darkness', en: 'Truth in Darkness' },
    subtitle: { it: 'Firenze, Maggio 2025', en: 'Firenze, May 2025' },
    images: [{ src: '/images/carte/library-quicksilver-contemplation.webp', alt: 'Quicksilver Contemplation' }],
  },
  {
    title: { it: 'Nazionale 2025', en: 'National Championship 2025' },
    subtitle: { it: 'Pordenone, Aprile 2025', en: 'Pordenone, April 2025' },
    images: [
      { src: '/images/carte/library-frico-drive.webp', alt: 'Frico Drive' },
      { src: '/images/carte/library-walk-of-caine.webp', alt: 'Walk of Caine' },
    ],
  },
  {
    title: { it: 'Grand Prix 2025', en: 'Grand Prix 2025' },
    subtitle: { it: 'Modena, Marzo 2025', en: 'Modena, March 2025' },
    images: [{ src: '/images/carte/library-seduction.webp', alt: 'Seduction' }],
  },
  {
    title: { it: 'Fee Stake: Florence', en: 'Fee Stake: Florence' },
    subtitle: { it: 'Firenze, Febbraio 2025', en: 'Firenze, February 2025' },
    images: [
      { src: '/images/carte/library-dual-form-1.webp', alt: 'Dual Form' },
      { src: '/images/carte/library-dual-form-4.webp', alt: 'Dual Form' },
    ],
  },
  {
    title: { it: 'Grand Prix 2024', en: 'Grand Prix 2024' },
    subtitle: { it: 'Milano, Dicembre 2023', en: 'Milano, December 2023' },
    images: [{ src: '/images/carte/library-mind-rape.webp', alt: 'Mind Rape' }],
  },
];
