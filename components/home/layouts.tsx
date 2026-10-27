import Image from 'next/image'
import Link from 'next/link'

import { categoryHref } from '@/lib/nav-categories'
import { cn } from '@/lib/utils'
import type { PostCard as Post } from '@/lib/utils'

const postHref = (p: Post) => `/blog/${p.slug}`
const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
const when = (p: Post) => fmt.format(new Date(p.date))

export type LayoutProps = { title: string; slug: string; posts: Post[] }

/* ---------- Briques communes ---------- */

function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6', className)}>
      {children}
    </div>
  )
}

function Thumb({
  post,
  className,
  sizes,
}: {
  post: Post
  className?: string
  sizes: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {post.image && (
        <Image
          src={post.image}
          alt=''
          fill
          sizes={sizes}
          style={{ objectPosition: post.focus }}
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      )}
    </div>
  )
}

type Tone = 'default' | 'dark' | 'primary'

function SectionHeader({
  title,
  slug,
  tone = 'default',
}: {
  title: string
  slug: string
  tone?: Tone
}) {
  if (!title) return null
  return (
    <div
      className={cn(
        'mb-5 flex items-end justify-between border-b-2 pb-2',
        tone === 'primary' ? 'border-white/40' : 'border-primary',
      )}
    >
      <h2 className={cn('text-h2', tone !== 'default' && 'text-white')}>
        {title}
      </h2>
      <Link
        href={categoryHref(slug)}
        className={cn(
          'text-badge hover:underline',
          tone === 'dark' && 'text-accent',
          tone === 'primary' && 'text-white',
          tone === 'default' && 'text-primary',
        )}
      >
        Tout voir →
      </Link>
    </div>
  )
}

// Tuile image plein cadre avec titre en surimpression.
function OverlayTile({
  post,
  className,
  sizes,
  large,
}: {
  post: Post
  className?: string
  sizes: string
  large?: boolean
}) {
  return (
    <Link
      href={postHref(post)}
      className={cn(
        'group relative block overflow-hidden rounded-xl bg-muted',
        className,
      )}
    >
      {post.image && (
        <Image
          src={post.image}
          alt=''
          fill
          sizes={sizes}
          style={{ objectPosition: post.focus }}
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 p-4 text-white'>
        <h3
          className={cn(
            large ? 'text-h2' : 'text-h3 text-base',
            'line-clamp-3',
          )}
        >
          {post.title}
        </h3>
        <span className='text-caption text-white/70'>{when(post)}</span>
      </div>
    </Link>
  )
}

/* ---------- 0. À la une ---------- */

export function Hero({ posts }: { posts: Post[] }) {
  const [main, ...side] = posts
  if (!main) return null
  return (
    <Container className='pt-6'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Link
          href={postHref(main)}
          className='group relative block aspect-[16/10] overflow-hidden rounded-xl bg-muted lg:col-span-2 lg:aspect-auto lg:min-h-[28rem]'
        >
          {main.image && (
            <Image
              src={main.image}
              alt=''
              fill
              priority
              sizes='(min-width:1024px) 66vw, 100vw'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
          <div className='absolute inset-x-0 bottom-0 p-5 text-white sm:p-8'>
            <span className='text-badge inline-block rounded bg-accent px-2 py-1 text-accent-foreground'>
              {main.category?.name ?? 'À la une'}
            </span>
            <h1 className='text-h1 mt-3'>{main.title}</h1>
          </div>
        </Link>

        <div className='flex flex-col divide-y divide-border rounded-xl border border-border bg-card'>
          {side.map((p) => (
            <Link
              key={p.id}
              href={postHref(p)}
              className='group flex gap-3 p-4'
            >
              <Thumb
                post={p}
                className='size-20 shrink-0 rounded-md'
                sizes='80px'
              />
              <div className='min-w-0'>
                <span className='text-kicker'>{p.category?.name}</span>
                <p className='text-h3 line-clamp-3 text-base group-hover:text-primary'>
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}

/* ---------- 1. Football : 1 grand + liste ---------- */

export function FeaturedList({ title, slug, posts }: LayoutProps) {
  const [main, ...rest] = posts
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid gap-6 lg:grid-cols-5'>
        <Link href={postHref(main)} className='group lg:col-span-3'>
          <Thumb
            post={main}
            className='aspect-video rounded-xl'
            sizes='(min-width:1024px) 60vw, 100vw'
          />
          <h3 className='text-h2 mt-3 group-hover:text-primary'>
            {main.title}
          </h3>
          <p className='text-lead mt-2 line-clamp-2 text-base'>
            {main.excerpt}
          </p>
        </Link>
        <ul className='divide-y divide-border lg:col-span-2'>
          {rest.map((p) => (
            <li key={p.id}>
              <Link
                href={postHref(p)}
                className='group flex gap-3 py-3 first:pt-0'
              >
                <Thumb
                  post={p}
                  className='h-16 w-24 shrink-0 rounded-md'
                  sizes='96px'
                />
                <div>
                  <p className='text-h3 line-clamp-2 text-base group-hover:text-primary'>
                    {p.title}
                  </p>
                  <span className='text-caption'>{when(p)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

/* ---------- 2. Basket : grille de cartes ---------- */

export function CardGrid({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={postHref(p)}
            className='group overflow-hidden rounded-xl border border-border bg-card'
          >
            <Thumb
              post={p}
              className='aspect-[4/3]'
              sizes='(min-width:1024px) 25vw, 50vw'
            />
            <div className='p-4'>
              <span className='text-caption'>{when(p)}</span>
              <h3 className='text-h3 mt-1 line-clamp-3 group-hover:text-primary'>
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

/* ---------- 3. Athlétisme & Course : carrousel ---------- */

export function Carousel({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6'>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={postHref(p)}
            className='group w-72 shrink-0 snap-start'
          >
            <Thumb post={p} className='aspect-[3/4] rounded-xl' sizes='288px' />
            <h3 className='text-h3 mt-3 line-clamp-3 group-hover:text-primary'>
              {p.title}
            </h3>
            <span className='text-caption'>{when(p)}</span>
          </Link>
        ))}
      </div>
    </Container>
  )
}

/* ---------- 4. Combat : bandeau sombre ---------- */

export function DarkBand({ title, slug, posts }: LayoutProps) {
  return (
    <section className='mt-14 bg-slate-950 py-10 text-white'>
      <Container>
        <SectionHeader title={title} slug={slug} tone='dark' />
        <div className='grid gap-4 md:grid-cols-3'>
          {posts.map((p) => (
            <Link
              key={p.id}
              href={postHref(p)}
              className='group relative block aspect-[4/5] overflow-hidden rounded-xl'
            >
              {p.image && (
                <Image
                  src={p.image}
                  alt=''
                  fill
                  sizes='(min-width:768px) 33vw, 100vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
              )}
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-5'>
                <h3 className='text-h3 line-clamp-3'>{p.title}</h3>
                <span className='text-caption text-white/70'>{when(p)}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------- 5. Sports mécaniques : classement numéroté ---------- */

export function Ranked({ title, slug, posts }: LayoutProps) {
  const [main] = posts
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid items-start gap-6 lg:grid-cols-2'>
        <ol className='divide-y divide-border'>
          {posts.map((p, i) => (
            <li key={p.id}>
              <Link
                href={postHref(p)}
                className='group flex items-center gap-4 py-4'
              >
                <span className='text-score w-12 shrink-0 text-primary/30 group-hover:text-primary'>
                  {i + 1}
                </span>
                <h3 className='text-h3 line-clamp-2 group-hover:text-primary'>
                  {p.title}
                </h3>
              </Link>
            </li>
          ))}
        </ol>
        <Link href={postHref(main)} className='group hidden lg:block'>
          <Thumb post={main} className='aspect-[4/3] rounded-xl' sizes='50vw' />
        </Link>
      </div>
    </Container>
  )
}

/* ---------- 6. Cyclisme : mosaïque (1 grande + 4 tuiles) ---------- */

export function Mosaic({ title, slug, posts }: LayoutProps) {
  const [main, ...rest] = posts
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid grid-cols-2 gap-3 md:auto-rows-[13rem] md:grid-cols-4'>
        <OverlayTile
          post={main}
          large
          sizes='(min-width:768px) 50vw, 100vw'
          className='col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto'
        />
        {rest.slice(0, 4).map((p) => (
          <OverlayTile
            key={p.id}
            post={p}
            sizes='(min-width:768px) 25vw, 50vw'
            className='aspect-[4/3] md:aspect-auto'
          />
        ))}
      </div>
    </Container>
  )
}

/* ---------- 7. Sports nautiques : bandeau coloré ---------- */

export function ColorBand({ title, slug, posts }: LayoutProps) {
  const [main, ...rest] = posts
  return (
    <section className='mt-14 bg-primary py-10 text-primary-foreground'>
      <Container>
        <SectionHeader title={title} slug={slug} tone='primary' />
        <div className='grid items-start gap-6 lg:grid-cols-2'>
          <Link href={postHref(main)} className='group block'>
            <Thumb
              post={main}
              className='aspect-video rounded-xl'
              sizes='(min-width:1024px) 50vw, 100vw'
            />
            <h3 className='text-h2 mt-3'>{main.title}</h3>
          </Link>
          <ul className='divide-y divide-white/20'>
            {rest.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Link
                  href={postHref(p)}
                  className='group flex items-center gap-4 py-4 first:pt-0'
                >
                  <Thumb
                    post={p}
                    className='size-20 shrink-0 rounded-full'
                    sizes='80px'
                  />
                  <div>
                    <span className='text-caption text-white/70'>
                      {when(p)}
                    </span>
                    <p className='text-h3 line-clamp-2 text-base group-hover:underline'>
                      {p.title}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

/* ---------- 8. Raquette : 2 grandes cartes + 3 brèves ---------- */

export function TwoUp({ title, slug, posts }: LayoutProps) {
  const top = posts.slice(0, 2)
  const rest = posts.slice(2, 5)
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid gap-6 md:grid-cols-2'>
        {top.map((p) => (
          <Link key={p.id} href={postHref(p)} className='group block'>
            <Thumb
              post={p}
              className='aspect-video rounded-xl'
              sizes='(min-width:768px) 50vw, 100vw'
            />
            <span className='text-caption mt-3 block'>{when(p)}</span>
            <h3 className='text-h2 mt-1 line-clamp-2 group-hover:text-primary'>
              {p.title}
            </h3>
          </Link>
        ))}
      </div>
      {rest.length > 0 && (
        <ul className='mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-3'>
          {rest.map((p) => (
            <li key={p.id}>
              <Link href={postHref(p)} className='group block'>
                <span className='text-caption'>{when(p)}</span>
                <p className='text-h3 line-clamp-2 text-base group-hover:text-primary'>
                  {p.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}

/* ---------- 9. Gym & Force : vedette verticale + grille 2×2 ---------- */

export function Spotlight({ title, slug, posts }: LayoutProps) {
  const [main, ...rest] = posts
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid gap-4 lg:grid-cols-5'>
        <OverlayTile
          post={main}
          large
          sizes='(min-width:1024px) 40vw, 100vw'
          className='aspect-[3/4] lg:col-span-2 lg:aspect-auto lg:min-h-[30rem]'
        />
        <div className='grid grid-cols-2 gap-4 lg:col-span-3'>
          {rest.slice(0, 4).map((p) => (
            <Link key={p.id} href={postHref(p)} className='group block'>
              <Thumb
                post={p}
                className='aspect-[4/3] rounded-xl'
                sizes='(min-width:1024px) 30vw, 50vw'
              />
              <h3 className='text-h3 mt-2 line-clamp-3 text-base group-hover:text-primary'>
                {p.title}
              </h3>
              <span className='text-caption'>{when(p)}</span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}

/* ---------- 10. Précision & Adresse : frise chronologique ---------- */

export function Timeline({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <ol className='ml-2 space-y-6 border-l-2 border-primary/20'>
        {posts.map((p) => (
          <li key={p.id} className='relative pl-6'>
            <span className='absolute -left-[7px] top-2 size-3 rounded-full bg-primary' />
            <Link href={postHref(p)} className='group flex items-start gap-4'>
              <div className='min-w-0 flex-1'>
                <span className='text-kicker'>{when(p)}</span>
                <h3 className='text-h3 mt-1 line-clamp-2 group-hover:text-primary'>
                  {p.title}
                </h3>
                <p className='text-lead mt-1 line-clamp-2 text-base'>
                  {p.excerpt}
                </p>
              </div>
              <Thumb
                post={p}
                className='hidden h-20 w-32 shrink-0 rounded-md sm:block'
                sizes='128px'
              />
            </Link>
          </li>
        ))}
      </ol>
    </Container>
  )
}

/* ---------- 11. Sports collectifs : cartes horizontales ---------- */

export function HorizontalCards({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid gap-4 md:grid-cols-2'>
        {posts.map((p) => (
          <Link
            key={p.id}
            href={postHref(p)}
            className='group flex gap-4 rounded-xl border border-border bg-card p-3'
          >
            <Thumb
              post={p}
              className='size-28 shrink-0 rounded-lg sm:size-36'
              sizes='144px'
            />
            <div className='min-w-0'>
              <span className='text-caption'>{when(p)}</span>
              <h3 className='text-h3 mt-1 line-clamp-2 group-hover:text-primary'>
                {p.title}
              </h3>
              <p className='text-caption mt-1 line-clamp-2'>{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}

/* ---------- 12. Sport & Business : colonnes éditoriales (sans image) ---------- */

export function TextColumns({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0'>
        {posts.slice(0, 3).map((p) => (
          <Link
            key={p.id}
            href={postHref(p)}
            className='group block py-5 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0'
          >
            <span className='text-kicker'>{p.category?.name ?? title}</span>
            <h3 className='text-h2 mt-2 line-clamp-3 group-hover:text-primary'>
              {p.title}
            </h3>
            <p className='text-lead mt-2 line-clamp-3 text-base'>{p.excerpt}</p>
            <span className='text-caption mt-3 block'>{when(p)}</span>
          </Link>
        ))}
      </div>
    </Container>
  )
}

/* ---------- 13. Portraits & Interviews : portraits en arche ---------- */

export function PortraitRow({ title, slug, posts }: LayoutProps) {
  return (
    <Container className='mt-12'>
      <SectionHeader title={title} slug={slug} />
      <div className='grid grid-cols-2 gap-5 lg:grid-cols-4'>
        {posts.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            href={postHref(p)}
            className='group block text-center'
          >
            <Thumb
              post={p}
              className='aspect-[3/4] rounded-t-full'
              sizes='(min-width:1024px) 25vw, 50vw'
            />
            <span className='text-kicker mt-3 block'>
              {p.category?.name ?? 'Portrait'}
            </span>
            <h3 className='text-h3 mt-1 line-clamp-3 text-base group-hover:text-primary'>
              {p.title}
            </h3>
          </Link>
        ))}
      </div>
    </Container>
  )
}

/* ---------- Blocs compacts (petites rubriques) ---------- */

export function CompactBlocks({ blocks }: { blocks: LayoutProps[] }) {
  return (
    <Container className='mt-14'>
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {blocks.map(({ title, slug, posts }) => {
          const [first, ...rest] = posts
          return (
            <section key={slug}>
              <SectionHeader title={title} slug={slug} />
              <Link href={postHref(first)} className='group block'>
                <Thumb
                  post={first}
                  className='aspect-video rounded-lg'
                  sizes='(min-width:1024px) 33vw, 50vw'
                />
                <h3 className='text-h3 mt-2 line-clamp-2 group-hover:text-primary'>
                  {first.title}
                </h3>
              </Link>
              <ul className='mt-3 divide-y divide-border'>
                {rest.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={postHref(p)}
                      className='block py-2 text-sm font-semibold hover:text-primary'
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </Container>
  )
}
