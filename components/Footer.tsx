// components/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'

import { NAV_GROUPS } from '@/lib/nav-categories'
import logo from '@/app/images/Logo2.png'

// Same 15 parent categories as the navbar, minus the technical "Non classé".
const FOOTER_GROUPS = NAV_GROUPS.filter((g) => g.slug !== 'non-classe')

const SITE_LINKS = [
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
  { label: 'Publicité', href: '/publicite' },
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'X', href: 'https://x.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
]

const linkClass =
  'text-sm text-foreground/80 transition-colors hover:text-primary'

export function FooterComponent() {
  const year = new Date().getFullYear()

  return (
    <footer className='mt-16 border-t border-border bg-secondary/50'>
      <div className='mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12'>
        {/* Brand */}
        <div className='lg:col-span-3'>
          <Link
            href='/'
            aria-label='Mian Sports, accueil'
            className='inline-block'
          >
            <Image
              src={logo}
              alt='Mian Sports'
              width={1896}
              height={830}
              className='h-14 w-auto'
            />
          </Link>
          <p className='mt-3 max-w-xs text-caption'>
            L&apos;actualité sportive en continu : football, basket, athlétisme,
            boxe, sports mécaniques et bien plus.
          </p>
        </div>

        {/* Rubriques : chaque rubrique parente avec ses sports */}
        <nav className='lg:col-span-6' aria-label='Rubriques'>
          <h2 className='text-kicker'>Rubriques</h2>
          <div className='mt-4 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3'>
            {FOOTER_GROUPS.map((group) => (
              <div key={group.slug}>
                <Link
                  href={group.href}
                  className='text-sm font-semibold text-foreground transition-colors hover:text-primary'
                >
                  {group.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* Site + social */}
        <div className='grid grid-cols-2 gap-6 lg:col-span-3 lg:grid-cols-1'>
          <nav aria-label='Informations'>
            <h2 className='text-kicker'>Le site</h2>
            <ul className='mt-4 space-y-2'>
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label='Réseaux sociaux'>
            <h2 className='text-kicker'>Suivez-nous</h2>
            <ul className='mt-4 space-y-2'>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className='border-t border-border'>
        <div className='mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <p className='text-caption'>
            © {year} Mian Sports. Tous droits réservés.
          </p>
          <p className='text-caption'>miansports.com</p>
        </div>
      </div>
    </footer>
  )
}
