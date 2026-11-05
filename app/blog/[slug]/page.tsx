import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getCardsByCategory } from '@/lib/home-data'
import { categoryHref, NAV_GROUPS } from '@/lib/nav-categories'
import { getPostBySlug } from '@/lib/post-data'
import { categories, cn } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const fmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Libellés courts (navbar) par slug, parents et sports.
const LABEL_BY_SLUG = new Map(
  NAV_GROUPS.flatMap((g) => [
    [g.slug, g.label] as [string, string],
    ...g.children.map((c) => [c.slug, c.label] as [string, string]),
  ]),
)

// Parmi les catégories de l'article, on garde la plus précise (le sous-sport
// plutôt que la rubrique parente, et jamais « Sport » ou « Non classé »).
const ALL = categories.flatMap((c) => [
  { ...c, depth: 0 },
  ...(c.children ?? []).map((ch) => ({ ...ch, depth: 1 })),
])
const GENERIC = new Set(['sport', 'non-classe'])

function mainCategory(ids: number[] = []) {
  return ALL.filter((c) => ids.includes(c.id) && !GENERIC.has(c.slug)).sort(
    (a, b) => b.depth - a.depth,
  )[0]
}

const plain = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const { card } = post
  const description = plain(card.excerpt ?? '').slice(0, 160)
  return {
    title: plain(card.title),
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: plain(card.title),
      description,
      publishedTime: post.raw.date,
      modifiedTime: post.raw.modified,
      images: card.image ? [card.image] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { raw, card } = post
  console.log(card.focus)
  const cat = mainCategory(raw.categories)
  const catLabel = cat ? (LABEL_BY_SLUG.get(cat.slug) ?? cat.name) : null
  const author = raw._embedded?.author?.[0]?.name

  // Articles à lire aussi : même catégorie, sans l'article courant.
  const related = cat
    ? (await getCardsByCategory(cat.slug, 5))
        .filter((p) => p.id !== card.id)
        .slice(0, 4)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: plain(card.title),
    datePublished: raw.date,
    dateModified: raw.modified ?? raw.date,
    image: card.image ? [card.image] : undefined,
    author: author ? { '@type': 'Person', name: author } : undefined,
    publisher: { '@type': 'Organization', name: 'Mian Sports' },
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
        <nav aria-label="Fil d'Ariane" className='text-caption'>
          <Link href='/' className='hover:text-primary'>
            Accueil
          </Link>
          {cat && (
            <>
              <span aria-hidden> / </span>
              <Link
                href={categoryHref(cat.slug)}
                className='hover:text-primary'
              >
                {catLabel}
              </Link>
            </>
          )}
        </nav>

        {cat && (
          <Link
            href={categoryHref(cat.slug)}
            className='text-badge mt-4 inline-block rounded bg-accent px-2 py-1 text-accent-foreground'
          >
            {catLabel}
          </Link>
        )}

        <h1
          className='text-h1 mt-3'
          dangerouslySetInnerHTML={{ __html: card.title }}
        />

        <p className='text-caption mt-3'>
          {author && <span>Par {author} · </span>}
          <time dateTime={raw.date}>{fmt.format(new Date(raw.date))}</time>
        </p>

        {card.image && (
          <div className='relative mt-6 aspect-video overflow-hidden rounded-xl bg-muted'>
            <Image
              src={card.image}
              alt=''
              fill
              priority
              sizes='(min-width:768px) 768px, 100vw'
              style={{ objectPosition: card.focus }}
              className='object-cover'
            />
          </div>
        )}

        {/* Contenu WordPress (HTML de notre propre back-office). */}
        <div
          className={cn(
            'mt-8 text-lg leading-relaxed',
            '[&_p]:mt-5 [&_a]:text-primary [&_a]:underline',
            '[&_h2]:text-h2 [&_h2]:mt-10 [&_h3]:text-h3 [&_h3]:mt-8',
            '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6',
            '[&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic',
            '[&_img]:mt-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg',
            '[&_figure]:mt-6 [&_figcaption]:text-caption [&_figcaption]:mt-2',
            '[&_iframe]:mt-6 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full',
          )}
          dangerouslySetInnerHTML={{ __html: raw.content.rendered }}
        />
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby='related'
          className='mx-auto mt-4 max-w-7xl px-4 sm:px-6'
        >
          <div className='mb-5 border-b-2 border-primary pb-2'>
            <h2 id='related' className='text-h2'>
              À lire aussi
            </h2>
          </div>
          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className='group overflow-hidden rounded-xl border border-border bg-card'
              >
                <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
                  {p.image && (
                    <Image
                      src={p.image}
                      alt=''
                      fill
                      sizes='(min-width:1024px) 25vw, 50vw'
                      style={{ objectPosition: p.focus }}
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  )}
                </div>
                <div className='p-4'>
                  <time dateTime={p.date} className='text-caption'>
                    {fmt.format(new Date(p.date))}
                  </time>
                  <h3 className='text-h3 mt-1 line-clamp-3 group-hover:text-primary'>
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
