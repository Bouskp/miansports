import { Post } from './wordpress.d'
import * as he from 'he'

export { cn } from 'cn'

export type Category = {
  id: number
  slug: string
  name: string
  children?: Category[]
}

export const categories: Category[] = [
  {
    id: 138,
    name: 'ATHLETISME, COURSE & MULTISPORT',
    slug: 'athletisme-course-multisport',
    children: [{ id: 151, name: 'Athletisme', slug: 'athletisme' }],
  },
  {
    id: 136,
    name: 'Autres Sports Collectifs',
    slug: 'autre-sport-collectifs',
    children: [{ id: 145, name: 'Rugby', slug: 'rugby' }],
  },
  { id: 135, name: 'Basketball', slug: 'basketball' },
  {
    id: 137,
    name: 'COMBAT & ARTS MARTIAUX',
    slug: 'combat-arts-martiaux',
    children: [
      { id: 149, name: 'Boxe', slug: 'boxe' },
      { id: 148, name: 'MMA', slug: 'mma' },
    ],
  },
  { id: 140, name: 'CYCLISME', slug: 'cyclisme' },
  { id: 134, name: 'Football', slug: 'football' },
  {
    id: 143,
    name: 'GYMNASTIQUE, FORCE & DISCIPLINES ARTISTIQUES',
    slug: 'gymnastique-force-disciplines-artistiques',
    children: [
      { id: 223, name: 'Gymnastique', slug: 'gymnastique' },
      { id: 231, name: 'Gymnastique rythmique', slug: 'gymnastique-rythmique' },
      { id: 222, name: 'Para-Powerlifting', slug: 'para-powerlifting' },
    ],
  },
  { id: 247, name: 'Portraits & Interviews', slug: 'portrait-interviews' },
  { id: 155, name: 'SPORT & BUSINESS', slug: 'sport-business' },
  {
    id: 142,
    name: 'SPORTS AQUATIQUES & NAUTIQUE',
    slug: 'sports-aquatiques-nautique',
    children: [
      { id: 152, name: 'Natation', slug: 'natation' },
      { id: 212, name: 'Planche à voile', slug: 'planche-a-voile' },
      { id: 202, name: 'Rafting', slug: 'rafting' },
      { id: 154, name: 'Surf', slug: 'surf' },
      { id: 153, name: 'Waterpolo', slug: 'waterpolo' },
    ],
  },
  {
    id: 144,
    name: 'SPORTS DE PRECISION & ADRESSE',
    slug: 'sports-de-precision-adresse',
    children: [
      { id: 232, name: 'Golf', slug: 'golf' },
      { id: 236, name: 'Jeu de fléchettes', slug: 'jeu-de-flechettes' },
      { id: 242, name: 'Tir sportif', slug: 'tir-sportif' },
      { id: 233, name: 'Tire à l’arce', slug: 'tire-a-larce' },
    ],
  },
  {
    id: 139,
    name: 'SPORTS DE RAQUETTE',
    slug: 'sports-de-raquette',
    children: [{ id: 150, name: 'Tennis', slug: 'tennis' }],
  },
  {
    id: 141,
    name: 'SPORTS MECANIQUES',
    slug: 'sports-mecanique',
    children: [
      { id: 175, name: 'Car spinning', slug: 'car-spinning' },
      { id: 146, name: 'Formule 1', slug: 'formule-1' },
      { id: 184, name: 'Moto GP', slug: 'moto-gp' },
      { id: 147, name: 'Rallye', slug: 'rallye' },
    ],
  },
  {
    id: 248,

    name: 'Dossiers Speciaux et Analyse',
    slug: 'dossiers-speciaux-et-analyse',
  },
]

const NAMED: Record<string, string> = {
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
}

export const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&(amp|quot|apos|nbsp|lt|gt);/g, (m) => NAMED[m])
    .trim()

export const decode2 = (s: string) => he.decode(s)

export type PostCard = {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
  focus?: string
  category: { name: string; slug: string } | null
  figcaption?: string | null
}

export function toCard(p: Post): PostCard {
  // WordPress renvoie les catégories en premier dans wp:term
  const cat = p._embedded?.['wp:term']?.[0]?.[0]
  return {
    id: p.id,
    slug: p.slug,
    title: decode(decode2(p.title.rendered)),
    excerpt: decode(decode2(p.excerpt.rendered)),
    date: p.date,
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
    focus: p.focal_point?.object_position ?? '50% 50%',
    category: cat ? { name: decode(decode2(cat.name)), slug: cat.slug } : null,
    figcaption: p._embedded?.['wp:featuredmedia']?.[0]?.caption?.rendered
      ? decode(decode2(p._embedded['wp:featuredmedia'][0].caption.rendered))
      : null,
  }
}
