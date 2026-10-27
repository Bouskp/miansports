import Image from 'next/image'
import Link from 'next/link'

import { MAGAZINE } from '@/lib/magazine'
import { cn } from '@/lib/utils'

const [left, center, right] = MAGAZINE.fan

// Cartes de l'éventail : légèrement inclinées, qui se chevauchent.
const FAN_STYLES = [
  'w-32 -rotate-6 sm:w-44',
  'relative z-10 w-36 sm:w-56',
  'w-32 rotate-6 sm:w-44',
]

export function MagazineSection() {
  const { number, href, allHref, cover, coverAlt } = MAGAZINE

  return (
    <section
      aria-labelledby='magazine-title'
      className='mt-14 bg-secondary/50 py-10'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='grid items-center gap-8 md:grid-cols-[minmax(0,17rem)_1fr] lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12'>
          {/* Couverture de l'édition */}
          <Link
            href={href}
            aria-label={`Lire l'édition ${number}`}
            className='group relative mx-auto block aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg bg-muted shadow-xl md:max-w-none'
          >
            <Image
              src={cover}
              alt={coverAlt}
              fill
              sizes='(min-width:1024px) 352px, (min-width:768px) 272px, 320px'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          </Link>

          <div>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h2 id='magazine-title' className='text-h2'>
                Edition N°{number}
              </h2>
              <div className='flex flex-wrap gap-2'>
                <Link
                  href={href}
                  className='text-badge rounded-full bg-foreground px-5 py-2.5 text-background transition-opacity hover:opacity-85'
                >
                  Lire l&apos;édition
                </Link>
                <Link
                  href={allHref}
                  className='text-badge rounded-full bg-muted px-5 py-2.5 text-foreground transition-colors hover:bg-border'
                >
                  Tous les magazines <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <hr className='my-6 border-border' />

            {/* Éventail de 3 visuels */}
            <div className='flex items-end justify-center -space-x-6 py-4 sm:-space-x-10'>
              {[left, center, right].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.alt}
                  className={cn(
                    'group relative block aspect-[3/4] shrink-0 overflow-hidden rounded-lg bg-muted shadow-lg transition-transform duration-300 hover:-translate-y-2',
                    FAN_STYLES[i],
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes='(min-width:640px) 224px, 144px'
                    className='object-cover'
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
