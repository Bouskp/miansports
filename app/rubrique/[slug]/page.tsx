import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  CardGrid,
  Carousel,
  ColorBand,
  DarkBand,
  FeaturedList,
  HorizontalCards,
  Mosaic,
  Ranked,
  Spotlight,
  Timeline,
  TwoUp,
  type LayoutProps,
} from '@/components/home/layouts'
import { getCardsByCategory } from '@/lib/home-data'
import { NAV_GROUPS } from '@/lib/nav-categories'
import { cn } from '@/lib/utils'

type Layout = (props: LayoutProps) => React.JSX.Element
type Block = { layout: Layout; count: number }
type Config = {
  // Couleur de l'en-tête de la page.
  tone: 'default' | 'dark'
  // Bloc « à la une » : les derniers articles de toute la rubrique.
  top: Block
  // Un bloc par sous-sport, dans l'ordre de lib/categories.
  children: Block[]
}

// Chaque rubrique a sa propre mise en page.
const CONFIG: Record<string, Config> = {
  'athletisme-course-multisport': {
    tone: 'default',
    top: { layout: Mosaic, count: 5 },
    children: [{ layout: Carousel, count: 8 }], // Athlétisme
  },
  'autre-sport-collectif': {
    tone: 'default',
    top: { layout: Spotlight, count: 5 },
    children: [{ layout: HorizontalCards, count: 6 }], // Rugby
  },
  'combat-arts-martiaux': {
    tone: 'dark',
    top: { layout: FeaturedList, count: 5 },
    children: [
      { layout: DarkBand, count: 3 }, // Boxe
      { layout: CardGrid, count: 4 }, // MMA
    ],
  },
  'gymnastique-force-disciplines-artistiques': {
    tone: 'default',
    top: { layout: TwoUp, count: 5 },
    children: [
      { layout: Carousel, count: 8 }, // Gymnastique
      { layout: Timeline, count: 5 }, // Gymnastique rythmique
      { layout: CardGrid, count: 4 }, // Para-powerlifting
    ],
  },
  'sports-aquatiques-nautique': {
    tone: 'default',
    top: { layout: ColorBand, count: 4 },
    children: [
      { layout: FeaturedList, count: 5 }, // Natation
      { layout: CardGrid, count: 4 }, // Planche à voile
      { layout: HorizontalCards, count: 4 }, // Rafting
      { layout: Carousel, count: 6 }, // Surf
      { layout: Ranked, count: 5 }, // Water-polo
    ],
  },
  'sports-de-precision-adresse': {
    tone: 'default',
    top: { layout: Timeline, count: 5 },
    children: [
      { layout: FeaturedList, count: 5 }, // Golf
      { layout: TwoUp, count: 5 }, // Fléchettes
      { layout: CardGrid, count: 4 }, // Tir sportif
      { layout: HorizontalCards, count: 4 }, // Tir à l'arc
    ],
  },
  'sports-de-raquette': {
    tone: 'default',
    top: { layout: DarkBand, count: 3 },
    children: [{ layout: FeaturedList, count: 5 }], // Tennis
  },
  'sports-mecanique': {
    tone: 'default',
    top: { layout: Ranked, count: 5 },
    children: [
      { layout: CardGrid, count: 4 }, // Car spinning
      { layout: Ranked, count: 5 }, // Formule 1
      { layout: Mosaic, count: 5 }, // Moto GP
      { layout: DarkBand, count: 3 }, // Rallye
    ],
  },
}

const FALLBACK: Block = { layout: CardGrid, count: 4 }

// Seules les rubriques qui ont des sous-catégories ont une page /rubrique/[slug].
const GROUPS = NAV_GROUPS.filter((g) => g.children.length > 0)

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return GROUPS.map((g) => ({ slug: g.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const group = GROUPS.find((g) => g.slug === slug)
  if (!group) return {}
  const sports = group.children.map((c) => c.label).join(', ')
  return {
    title: `${group.label} : actualités et articles`,
    description: `Toute l'actualité ${group.label.toLowerCase()} : ${sports}.`,
  }
}

export default async function RubriquePage({ params }: Props) {
  const { slug } = await params
  const group = GROUPS.find((g) => g.slug === slug)
  if (!group) notFound()

  const config = CONFIG[slug]
  const top = config?.top ?? FALLBACK
  const dark = config?.tone === 'dark'

  // Le parent inclut les articles de toutes ses sous-catégories (voir home-data).
  const [latest, ...childPosts] = await Promise.all([
    getCardsByCategory(group.slug, top.count),
    ...group.children.map((c, i) =>
      getCardsByCategory(c.slug, (config?.children[i] ?? FALLBACK).count),
    ),
  ])

  const sections = group.children
    .map((child, i) => ({
      child,
      posts: childPosts[i],
      Layout: (config?.children[i] ?? FALLBACK).layout,
    }))
    .filter((s) => s.posts.length > 0)

  const TopLayout = top.layout
  const empty = latest.length === 0 && sections.length === 0

  return (
    <>
      <div className={cn(dark && 'bg-slate-950 text-white')}>
        <header className='mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6'>
          <nav
            aria-label="Fil d'Ariane"
            className={cn('text-caption', dark && 'text-white/70')}
          >
            <Link href='/' className='hover:text-primary'>
              Accueil
            </Link>
            <span aria-hidden> / </span>
            <span>{group.label}</span>
          </nav>
          <h1 className='text-h1 mt-2'>{group.label}</h1>

          <ul className='mt-5 flex flex-wrap gap-2'>
            {group.children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={child.href}
                  className={cn(
                    'text-badge inline-block rounded-full border px-4 py-2 transition-colors',
                    dark
                      ? 'border-white/30 hover:border-accent hover:text-accent'
                      : 'border-border hover:border-primary hover:text-primary',
                  )}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </header>
      </div>

      {empty && (
        <p className='mx-auto mt-12 max-w-7xl px-4 text-lead sm:px-6'>
          Aucun article dans cette rubrique pour le moment.
        </p>
      )}

      {/* Titre vide : le layout n'affiche pas d'en-tête de section. */}
      {/* {latest.length > 0 && (
        <TopLayout title='' slug={group.slug} posts={latest} />
      )} */}

      {sections.map(({ child, posts, Layout }) => (
        <Layout
          key={child.slug}
          title={child.label}
          slug={child.slug}
          posts={posts}
        />
      ))}
    </>
  )
}
