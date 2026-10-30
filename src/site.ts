// Site-wide settings, ported from the Jekyll _config.yml.

export interface NavPage {
  title: string;
  href: string;
}

export const site = {
  title: 'The Fish Tree of Life',
  tagline: 'taxonomy, phylogenies, fossils, and more',
  description:
    'A comprehensive resource for ray-finned fish (Actinopterygii) phylogenetics, the taxonomy of fishes, and fossils of extinct fishes.',
  url: 'https://fishtreeoflife.org',
  locale: 'en_US',
  author: {
    name: 'Jonathan Chang',
    email: 'me@jonathanchang.org',
    url: 'https://fishtreeoflife.org',
  },
  github: 'jonchang',
  twitter: 'chang_jon',
  googleAnalytics: 'G-TX72S224E0',
  image: 'https://fishtreeoflife.org/downloads/front-page-tree@1x.png',
  /** Header navigation, in order. */
  nav: [
    { title: 'About', href: '/about/' },
    { title: 'Methods', href: '/methods/' },
    { title: 'Taxonomy', href: '/taxonomy/' },
    { title: 'Fossils', href: '/fossils/' },
    { title: 'Downloads', href: '/downloads/' },
  ] as NavPage[],
};
