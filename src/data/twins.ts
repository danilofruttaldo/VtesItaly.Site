export interface Twin {
  card: string;
  person: { it: string; en: string };
  image: string;
  description: { it: string; en: string };
}

export const twins: Twin[] = [
  {
    card: 'Maila',
    person: { it: 'Maila Nurmi', en: 'Maila Nurmi' },
    image: '/images/gemelli/maila-nurmi.webp',
    description: {
      it: 'Primogena della Camarilla ispirata all\'icona del cinema horror. Stessa posa, stesso sguardo magnetico.',
      en: 'Camarilla primogen inspired by the horror cinema icon. Same pose, same magnetic gaze.',
    },
  },
  {
    card: 'Carna, The Princess Witch',
    person: { it: 'Alyson Hannigan', en: 'Alyson Hannigan' },
    image: '/images/gemelli/alyson-hannigan.webp',
    description: {
      it: 'La strega Tremere ricorda irresistibilmente Willow di Buffy. Stessi capelli rossi, stesso potere mistico.',
      en: 'The Tremere witch irresistibly recalls Willow from Buffy. Same red hair, same mystic power.',
    },
  },
  {
    card: 'Lady Zara Slatikov',
    person: { it: 'Carrie-Anne Moss', en: 'Carrie-Anne Moss' },
    image: '/images/gemelli/carrie-anne-moss.webp',
    description: {
      it: 'Il fascino gotico del vescovo Sabbat richiama Trinity di Matrix. Eleganza oscura e determinazione letale.',
      en: 'The gothic charm of the Sabbat bishop recalls Trinity from The Matrix. Dark elegance and lethal determination.',
    },
  },
  {
    card: 'Sir Walter Nash',
    person: { it: 'Donald Trump (anni \'80)', en: 'Donald Trump (1980s)' },
    image: '/images/gemelli/donald-trump.webp',
    description: {
      it: 'Il Principe di Chicago somiglia al celebre imprenditore newyorkese nei suoi anni d\'oro. Coincidenza?',
      en: 'The Prince of Chicago resembles the famous New York entrepreneur in his prime years. Coincidence?',
    },
  },
  {
    card: 'Ira Rivers',
    person: { it: 'Dwayne "The Rock" Johnson', en: 'Dwayne "The Rock" Johnson' },
    image: '/images/gemelli/dwayne-johnson.webp',
    description: {
      it: 'Il Principe di Dallas ha lo stesso fisico imponente e lo sguardo intenso del celebre wrestler-attore.',
      en: 'The Prince of Dallas has the same imposing physique and intense gaze of the famous wrestler-actor.',
    },
  },
  {
    card: 'Monica Giovanni',
    person: { it: 'Giorgia Meloni', en: 'Giorgia Meloni' },
    image: '/images/gemelli/giorgia-meloni.webp',
    description: {
      it: 'Tocco gelido ed eleganza austera del vampiro indipendente richiamano la nota politica italiana.',
      en: 'Icy touch and austere elegance of the independent vampire reflect Italy\'s prominent politician.',
    },
  },
  {
    card: 'Izhim abd Azrael',
    person: { it: 'Kurt Cobain', en: 'Kurt Cobain' },
    image: '/images/gemelli/kurt-cobain.webp',
    description: {
      it: 'Il tormentato Serafino della Mano Nera ricorda il frontman dei Nirvana. Stesso sguardo perso, stessa intensità.',
      en: 'The tormented Seraph of the Black Hand recalls the Nirvana frontman. Same lost gaze, same intensity.',
    },
  },
  {
    card: 'Horst von Bruhl',
    person: { it: 'Massimo Boldi', en: 'Massimo Boldi' },
    image: '/images/gemelli/massimo-boldi.webp',
    description: {
      it: 'Il Principe di Mannheim vs il re della commedia italiana. La somiglianza è sorprendente.',
      en: 'The Prince of Mannheim vs the king of Italian comedy. The resemblance is surprising.',
    },
  },
  {
    card: 'Massimiliano',
    person: { it: 'Max Cavalera', en: 'Max Cavalera' },
    image: '/images/gemelli/max-cavalera.webp',
    description: {
      it: 'Il barone anarchico ha il volto e lo spirito ribelle del frontman di Sepultura/Soulfly.',
      en: 'The anarchic Baron has the face and rebellious spirit of the Sepultura/Soulfly frontman.',
    },
  },
  {
    card: 'Madeleine Giovanni',
    person: { it: 'Valentina Nappi', en: 'Valentina Nappi' },
    image: '/images/gemelli/valentina-nappi.webp',
    description: {
      it: 'Occhiali scuri e portamento sicuro del vampiro indipendente ricordano un celebre scatto glamour.',
      en: 'Dark sunglasses and confident bearing of the independent vampire recall a famous glamour shoot.',
    },
  },
];
