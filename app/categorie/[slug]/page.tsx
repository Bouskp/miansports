import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getCategoryPage } from '@/lib/home-data'
import { NAV_GROUPS, type NavGroup } from '@/lib/nav-categories'
import { cn } from '@/lib/utils'

const PER_PAGE = 12

// Tous les slugs connus (parents + sports) avec leur libellé et leur parent.
type Info = { label: string; parent: NavGroup | null; hasChildren: boolean }

const INFO = new Map<string, Info>(
  NAV_GROUPS.flatMap((g): [string, Info][] => [
    [
      g.slug,
      { label: g.label, parent: null, hasChildren: g.children.length > 0 },
    ],
    ...g.children.map((c): [string, Info] => [
      c.slug,
      { label: c.label, parent: g, hasChildren: false },
    ]),
  ]),
)

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string) => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params
  const { page } = await searchParams
  const info = INFO.get(slug)
  if (!info) return {}
  const n = parsePage(page)
  return {
    title: `${info.label}${n > 1 ? ` – page ${n}` : ''} : actualités et articles`,
    description: `Toute l'actualité ${info.label.toLowerCase()}.`,
    alternates: { canonical: `/categorie/${slug}${n > 1 ? `?page=${n}` : ''}` },
  }
}

export default async function CategoriePage({ params, searchParams }: Props) {
  const { slug } = await params
  const info = INFO.get(slug)
  if (!info) notFound()

  // Les rubriques qui ont des sous-catégories ont leur propre page.
  if (info.hasChildren) redirect(`/rubrique/${slug}`)

  const page = parsePage((await searchParams).page)
  const { posts, hasNext } = await getCategoryPage(slug, page, PER_PAGE)

  // Page demandée au-delà de la dernière.
  if (posts.length === 0 && page > 1) notFound()

  const pageHref = (n: number) =>
    n <= 1 ? `/categorie/${slug}` : `/categorie/${slug}?page=${n}`

  const fmt = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      <nav aria-label="Fil d'Ariane" className='text-caption'>
        <Link href='/' className='hover:text-primary'>
          Accueil
        </Link>
        {info.parent && (
          <>
            <span aria-hidden> / </span>
            <Link href={info.parent.href} className='hover:text-primary'>
              {info.parent.label}
            </Link>
          </>
        )}
        <span aria-hidden> / </span>
        <span>{info.label}</span>
      </nav>

      <h1 className='text-h1 mt-2'>{info.label}</h1>

      {/* Frères de la même rubrique */}
      {info.parent && (
        <ul className='mt-5 flex flex-wrap gap-2'>
          {info.parent.children.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                aria-current={c.slug === slug ? 'page' : undefined}
                className={cn(
                  'text-badge inline-block rounded-full border px-4 py-2 transition-colors',
                  c.slug === slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary hover:text-primary',
                )}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {posts.length === 0 ? (
        <p className='text-lead mt-12'>
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((p, i) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className='group overflow-hidden rounded-xl border border-border bg-card'
            >
              <div className='relative aspect-video overflow-hidden bg-muted'>
                {p.image && (
                  <Image
                    src={p.image}
                    alt=''
                    fill
                    priority={page === 1 && i < 3}
                    sizes='(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'
                    style={{ objectPosition: p.focus }}
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                )}
              </div>
              <div className='p-4'>
                <time dateTime={p.date} className='text-caption'>
                  {fmt.format(new Date(p.date))}
                </time>
                <h2 className='text-h3 mt-1 line-clamp-3 group-hover:text-primary'>
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className='text-caption mt-2 line-clamp-2'>{p.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {(page > 1 || hasNext) && (
        <nav
          aria-label='Pagination'
          className='mt-10 flex items-center justify-between gap-4 border-t border-border pt-6'
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              rel='prev'
              className='text-badge rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary'
            >
              ← Plus récents
            </Link>
          ) : (
            <span />
          )}
          <span className='text-caption'>Page {page}</span>
          {hasNext ? (
            <Link
              href={pageHref(page + 1)}
              rel='next'
              className='text-badge rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary'
            >
              Plus anciens →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
