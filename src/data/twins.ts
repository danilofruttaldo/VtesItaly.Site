export interface Twin {
  card: string;
  person: { it: string; en: string };
  image: string;
  description: { it: string; en: string };
}

export const twins: Twin[] = [
  {
    card: 'Bela',
    person: { it: 'Bela Lugosi', en: 'Bela Lugosi' },
    image: '/images/gemelli/bela-lugosi.webp',
    description: {
      it: "L'indipendente dal nome evocativo ricorda il leggendario attore ungherese, icona del Dracula cinematografico. Stessi lineamenti affilati, stesso sguardo ipnotico e stesso fascino gotico.",
      en: 'The independent with the evocative name recalls the legendary Hungarian actor, icon of cinematic Dracula. Same sharp features, same hypnotic gaze, and same gothic allure.',
    },
  },
  {
    card: 'Camille Devereux',
    person: { it: 'Stephanie Seymour', en: 'Stephanie Seymour' },
    image: '/images/gemelli/stephanie-seymour.webp',
    description: {
      it: 'La Gangrel della Camarilla ricorda la celebre supermodella americana. Stessa posa a braccia incrociate, stessa chioma fluente e stesso fascino seducente.',
      en: 'The Camarilla Gangrel recalls the famous American supermodel. Same crossed-arms pose, same flowing hair, and same seductive allure.',
    },
  },
  {
    card: 'Aleister Crowley',
    person: { it: 'Aleister Crowley', en: 'Aleister Crowley' },
    image: '/images/gemelli/aleister-crowley.webp',
    description: {
      it: 'Il Malkavian della Camarilla ricorda il vero occultista inglese. Stessa testa rasata, stesso sguardo inquietante.',
      en: 'The Camarilla Malkavian recalls the real English occultist. Same shaved head, same unsettling gaze.',
    },
  },
  {
    card: 'Maila',
    person: { it: 'Maila Nurmi', en: 'Maila Nurmi' },
    image: '/images/gemelli/maila-nurmi.webp',
    description: {
      it: "La Toreador primogena della Camarilla richiama l'icona horror Vampira. Stesso taglio rasato, stesso sguardo magnetico in total black.",
      en: 'The Toreador Camarilla primogen recalls horror icon Vampira. Same shaved cut, same magnetic gaze in total black.',
    },
  },
  {
    card: 'Carna, The Princess Witch',
    person: { it: 'Alyson Hannigan', en: 'Alyson Hannigan' },
    image: '/images/gemelli/alyson-hannigan.webp',
    description: {
      it: 'La strega Tremere della Camarilla ricorda irresistibilmente Willow di Buffy. Stessi capelli rossi, stesso sguardo determinato.',
      en: 'The Camarilla Tremere witch irresistibly recalls Willow from Buffy. Same red hair, same determined gaze.',
    },
  },
  {
    card: 'Lady Zara Slatikov',
    person: { it: 'Carrie-Anne Moss', en: 'Carrie-Anne Moss' },
    image: '/images/gemelli/carrie-anne-moss.webp',
    description: {
      it: 'Il vescovo Sabbat richiama Trinity di Matrix. Stessi capelli scuri, stesso fascino gotico in abito nero.',
      en: 'The Sabbat bishop recalls Trinity from The Matrix. Same dark hair, same gothic charm in a black outfit.',
    },
  },
  {
    card: 'Sir Walter Nash',
    person: { it: "Donald Trump (anni '80)", en: 'Donald Trump (1980s)' },
    image: '/images/gemelli/donald-trump.webp',
    description: {
      it: "Il Principe Ventrue di Chicago ricorda il celebre imprenditore newyorkese nei suoi anni d'oro. Stesso ciuffo, stessa cravatta e stesso sguardo di chi comanda.",
      en: 'The Ventrue Prince of Chicago recalls the famous New York entrepreneur in his prime years. Same coiffure, same tie, and same commanding gaze.',
    },
  },
  {
    card: 'Ira Rivers',
    person: { it: 'Dwayne "The Rock" Johnson', en: 'Dwayne "The Rock" Johnson' },
    image: '/images/gemelli/dwayne-johnson.webp',
    description: {
      it: 'Il Principe di Dallas ricorda il celebre wrestler-attore. Stesso fisico imponente, stessi occhiali da sole e stesso sguardo intenso.',
      en: 'The Prince of Dallas recalls the famous wrestler-actor. Same imposing physique, same sunglasses, and same intense gaze.',
    },
  },
  {
    card: 'Monica Giovanni',
    person: { it: 'Giorgia Meloni', en: 'Giorgia Meloni' },
    image: '/images/gemelli/giorgia-meloni.webp',
    description: {
      it: 'La Giovanni indipendente ricorda la nota politica italiana. Stessi lineamenti decisi, stessa espressione autorevole.',
      en: 'The independent Giovanni recalls the prominent Italian politician. Same strong features, same authoritative expression.',
    },
  },
  {
    card: 'Izhim abd Azrael',
    person: { it: 'Kurt Cobain', en: 'Kurt Cobain' },
    image: '/images/gemelli/kurt-cobain.webp',
    description: {
      it: 'Il Serafino della Mano Nera ricorda il frontman dei Nirvana. Stessi capelli biondi sul viso, stessa intensità tormentata.',
      en: 'The Seraph of the Black Hand recalls the Nirvana frontman. Same blond hair over the face, same tormented intensity.',
    },
  },
  {
    card: 'Horst von Bruhl',
    person: { it: 'Massimo Boldi', en: 'Massimo Boldi' },
    image: '/images/gemelli/massimo-boldi.webp',
    description: {
      it: 'Il Principe di Mannheim ricorda il re della commedia italiana. Stesso viso tondo, stessa stempiatura e stesso abito elegante con cravatta.',
      en: 'The Prince of Mannheim recalls the king of Italian comedy. Same round face, same receding hairline, and same elegant suit with tie.',
    },
  },
  {
    card: 'Massimiliano',
    person: { it: 'Max Cavalera', en: 'Max Cavalera' },
    image: '/images/gemelli/max-cavalera.webp',
    description: {
      it: 'Il Barone anarchico di Belo Horizonte ricorda il frontman di Sepultura e Soulfly. Stessi dreadlock, stessa barba e stesso spirito ribelle.',
      en: 'The Anarch Baron of Belo Horizonte recalls the Sepultura and Soulfly frontman. Same dreadlocks, same beard, and same rebellious spirit.',
    },
  },
  {
    card: 'Madeleine Giovanni',
    person: { it: 'Valentina Nappi', en: 'Valentina Nappi' },
    image: '/images/gemelli/valentina-nappi.webp',
    description: {
      it: 'La Giovanni indipendente ricorda un celebre scatto glamour della nota attrice italiana. Stessi occhiali scuri, stesso outfit nero e stesso portamento sicuro.',
      en: 'The independent Giovanni recalls a famous glamour shot of the noted Italian actress. Same dark sunglasses, same black outfit, and same confident bearing.',
    },
  },
];
