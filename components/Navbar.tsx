'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NAV_GROUPS, type NavGroup } from '@/lib/nav-categories'
import { cn } from '@/lib/utils'
import logo from '@/app/images/Logo2.png'

// Exact match or sub-path, so "/categorie/sport" is not active on "/categorie/sport-business".
function isActive(pathname: string, href: string) {
  return href === '/'
    ? pathname === '/'
    : pathname === href || pathname.startsWith(`${href}/`)
}

// Une rubrique reste active sur ses sous-catégories (ex. /categorie/boxe → Combat).
function isGroupActive(pathname: string, group: NavGroup) {
  return (
    isActive(pathname, group.href) ||
    group.children.some((c) => isActive(pathname, c.href))
  )
}

export function NavComponent() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75'>
      {/* Row 1: logo + actions */}
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          href='/'
          className='text-h3 text-primary'
          aria-label='Mian Sports, accueil'
        >
          <Link href='/' aria-label='Mian Sports, accueil' className='shrink-0'>
            <Image
              src={logo}
              alt='Mian Sports'
              width={1896}
              height={830}
              priority
              className='h-11 w-auto'
            />
          </Link>
        </Link>

        <div className='flex items-center gap-2'>
          <Link
            href='/direct'
            className='text-badge inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-2 text-live-foreground'
          >
            {"S'abonner"}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant='ghost'
                  size='icon'
                  className='lg:hidden'
                  aria-label='Ouvrir le menu'
                />
              }
            >
              <Menu className='size-5' />
            </SheetTrigger>
            <SheetContent side='right' className='w-80 overflow-y-auto'>
              <SheetHeader>
                <SheetTitle className='text-h3 text-primary'>Menu</SheetTitle>
              </SheetHeader>
              <nav
                className='flex flex-col gap-1 px-4 pb-6'
                aria-label='Navigation mobile'
              >
                <Link
                  href='/'
                  onClick={closeMenu}
                  aria-current={pathname === '/' ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-3 text-base font-semibold hover:bg-muted',
                    pathname === '/' && 'text-primary',
                  )}
                >
                  Accueil
                </Link>

                {NAV_GROUPS.map((group) => (
                  <Link
                    key={group.slug}
                    href={group.href}
                    onClick={closeMenu}
                    aria-current={
                      isActive(pathname, group.href) ? 'page' : undefined
                    }
                    className={cn(
                      'rounded-md px-3 py-3 text-base font-semibold hover:bg-muted',
                      isGroupActive(pathname, group) && 'text-primary',
                    )}
                  >
                    {group.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Row 2 (desktop): toutes les rubriques en liens simples */}
      <nav
        className='hidden border-t border-border lg:block'
        aria-label='Navigation principale'
      >
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-1 px-4 py-1 sm:px-6'>
          <Link
            href='/'
            aria-current={pathname === '/' ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted',
              pathname === '/' ? 'text-primary' : 'text-foreground/80',
            )}
          >
            Accueil
          </Link>

          {NAV_GROUPS.map((group) => (
            <Link
              key={group.slug}
              href={group.href}
              aria-current={isActive(pathname, group.href) ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted',
                isGroupActive(pathname, group)
                  ? 'text-primary'
                  : 'text-foreground/80',
              )}
            >
              {group.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
