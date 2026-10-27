// Données de la section « Magazine » de l'accueil.
// Les images sont à déposer dans public/magazine/ (ou à remplacer par des URLs
// du site du magazine, à condition d'ajouter son domaine à
// `images.remotePatterns` dans next.config).

const BASE =
  process.env.NEXT_PUBLIC_MAGAZINE_URL ??
  'https://api.hamanie.news//wp-json/wp/v2/h_magazine'

export type MagazineFanItem = { href: string; image: string; alt: string }

export type MagazineEdition = {
  number: number
  href: string
  allHref: string
  cover: string
  coverAlt: string
  fan: MagazineFanItem[]
}

export const MAGAZINE: MagazineEdition = {
  number: 12,
  href: `${BASE}/magazine/1`,
  allHref: `${BASE}/magazine`,
  cover: '/magazine/edition-12.jpg',
  coverAlt:
    "Couverture de l'édition 12 — Georges Weah, de Monrovia au Ballon d'Or",
  // Trois visuels en éventail : gauche, centre (portrait), droite.
  fan: [
    {
      href: `${BASE}/magazine/1`,
      image: '/magazine/fan-1.jpg',
      alt: 'Magazine Africa Sports',
    },
    {
      href: `${BASE}/magazine/2`,
      image: '/magazine/fan-2.jpg',
      alt: "Portrait associé à l'édition",
    },
    {
      href: `${BASE}/magazine/3`,
      image: '/magazine/fan-3.jpg',
      alt: 'Magazine Africa Sports',
    },
  ],
}
