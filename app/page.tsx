import {
  CardGrid,
  Carousel,
  ColorBand,
  CompactBlocks,
  DarkBand,
  FeaturedList,
  Hero,
  HorizontalCards,
  Mosaic,
  PortraitRow,
  Ranked,
  Spotlight,
  TextColumns,
  Timeline,
  TwoUp,
  type LayoutProps,
} from '@/components/home/layouts'
import { MagazineSection } from '@/components/home/magazine'
import { getCardsByCategory, getLatestCards } from '@/lib/home-data'
import { NAV_GROUPS } from '@/lib/nav-categories'
import { Fragment } from 'react'

type Layout = (props: LayoutProps) => React.JSX.Element

// Titres alignés sur le navbar (labels courts définis dans lib/nav-categories).
const titleOf = (slug: string) =>
  NAV_GROUPS.find((g) => g.slug === slug)?.label ?? slug

// Une rubrique parente = une section, chacune avec son propre layout.
// Les articles des sous-sports sont inclus. Une section sans article est masquée.
const SECTIONS: {
  slug: string
  layout: Layout
  count: number
}[] = [
  { slug: 'football', layout: FeaturedList, count: 5 },
  { slug: 'basketball', layout: CardGrid, count: 4 },
  { slug: 'autre-sport-collectifs', layout: HorizontalCards, count: 4 },
  { slug: 'dossiers-speciaux-et-analyse', layout: CardGrid, count: 4 },
  { slug: 'sport-business', layout: TextColumns, count: 3 },
  { slug: 'portrait-interviews', layout: PortraitRow, count: 4 },
  { slug: 'combat-arts-martiaux', layout: DarkBand, count: 4 },
  { slug: 'athletisme-course-multisport', layout: Carousel, count: 8 },
  { slug: 'sports-de-raquette', layout: TwoUp, count: 5 },
  { slug: 'cyclisme', layout: Mosaic, count: 5 },
  { slug: 'sports-mecanique', layout: Ranked, count: 5 },
  {
    slug: 'gymnastique-force-disciplines-artistiques',
    layout: Spotlight,
    count: 5,
  },
  { slug: 'sports-aquatiques-nautique', layout: ColorBand, count: 4 },

  { slug: 'sports-de-precision-adresse', layout: Timeline, count: 5 },
]

// Rubrique générique, affichée en bloc compact.

export const revalidate = 3600

export default async function HomePage() {
  const [latest, sectionPosts] = await Promise.all([
    getLatestCards(6),
    Promise.all(SECTIONS.map((s) => getCardsByCategory(s.slug, s.count))),
  ])

  return (
    <>
      <Hero posts={latest} />
      {SECTIONS.map((s, i) => {
        const posts = sectionPosts[i]
        if (!posts.length) return <p key={i}>{s.slug}</p>
        const Section = s.layout
        return (
          <Fragment key={s.slug}>
            <Section title={titleOf(s.slug)} slug={s.slug} posts={posts} />
          </Fragment>
        )
      })}
    </>
  )
}
