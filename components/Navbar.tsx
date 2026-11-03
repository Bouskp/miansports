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
      <div className='mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6'>
        {/* Gauche : burger */}
        <div className='flex items-center justify-start'>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Ouvrir le menu'
                />
              }
            >
              <Menu className='size-5' />
            </SheetTrigger>
            <SheetContent side='left' className='w-80 overflow-y-auto sm:w-96'>
              <SheetHeader>
                <SheetTitle className='text-h3 text-primary'>Menu</SheetTitle>
              </SheetHeader>
              <nav
                className='flex flex-col gap-1 px-4 pb-6'
                aria-label='Navigation principale'
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

        {/* Centre : logo */}
        <Link
          href='/'
          aria-label='Mian Sports, accueil'
          className='justify-self-center'
        >
          <Image
            src={logo}
            alt='Mian Sports'
            width={1896}
            height={830}
            priority
            className='h-11 w-auto'
          />
        </Link>

        {/* Droite : S'abonner */}
        <div className='flex items-center justify-end'>
          <Link
            href='/direct'
            className='text-badge inline-flex items-center gap-1.5 rounded-full bg-live px-3 py-2 text-live-foreground'
          >
            {"S'abonner"}
          </Link>
        </div>
      </div>
    </header>
  )
}
