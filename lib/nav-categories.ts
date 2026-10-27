import { categories } from '@/lib/utils'

export type NavLink = { label: string; href: string; slug: string }
export type NavGroup = NavLink & { children: NavLink[] }

// Short display labels (WordPress names are long, in capitals, or inconsistent)
const LABELS: Record<string, string> = {
  // Rubriques parentes
  'athletisme-course-multisport': 'Athletisme, Course & Multisport',
  'autre-sport-collectifs': 'Autres Sports collectifs',
  'combat-arts-martiaux': 'Combat & Arts Martiaux',
  'dossiers-speciaux-et-analyse': 'Dossiers Spéciaux et Analyse',
  'gymnastique-force-disciplines-artistiques':
    'Gymnastique, Force & Disciplines Artistiques',
  'sports-aquatiques-nautique': 'Sports Aquatiques & Nautique',
  'sports-de-precision-adresse': 'Sports de Precision & Adresse',
  'sports-de-raquette': 'Sports de Raquette',
  'sports-mecanique': 'Sports mécaniques',
  'sport-business': 'Sport & Business',
  'portrait-interviews': 'Portraits & Interviews',
  cyclisme: 'Cyclisme',
}

// Order of the 15 parent categories in the navbar.
const ORDER = [
  'football',
  'basketball',
  'autre-sport-collectifs',
  'sport-business',
  'portrait-interviews',
  'athletisme-course-multisport',
  'combat-arts-martiaux',
  'sports-mecanique',
  'cyclisme',
  'sports-de-raquette',
  'sports-aquatiques-nautique',
  'gymnastique-force-disciplines-artistiques',
  'sports-de-precision-adresse',
  'sport',
  'non-classe',
]

const decode = (s: string) => s.replace(/&amp;/g, '&')

type Cat = (typeof categories)[number]

export const categoryHref = (slug: string) => {
  const cat = categories.find((c) => c.slug === slug)
  return cat?.children?.length ? `/rubrique/${slug}` : `/categorie/${slug}`
}

const toLink = (c: Cat): NavLink => ({
  label: LABELS[c.slug] ?? decode(c.name),
  href: categoryHref(c.slug),
  slug: c.slug,
})

const rank = (slug: string) => {
  const i = ORDER.indexOf(slug)
  return i === -1 ? ORDER.length : i
}

// One entry per top-level category (with its sub-sports as children).
export const NAV_GROUPS: NavGroup[] = [...categories]
  .sort((a, b) => rank(a.slug) - rank(b.slug))
  .map((c) => ({
    ...toLink(c),
    children: (c.children ?? []).map(toLink),
  }))
