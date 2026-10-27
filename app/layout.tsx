import { Barlow_Condensed, Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NavComponent } from '@/components/Navbar'
import { FooterComponent } from '@/components/Footer'

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='fr'
      className={`${body.variable} ${display.variable} ${mono.variable}`}
    >
      <NavComponent />
      <body>{children}</body>
      <FooterComponent />
    </html>
  )
}
