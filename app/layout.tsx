import type { Metadata, Viewport } from 'next'
import { Public_Sans, Source_Serif_4 } from 'next/font/google'
import { Providers } from '@/components/providers'
import { SiteHeader, BottomNav, SiteFooter } from '@/components/shell'
import './globals.css'

const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })
const sans = Public_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'FundAfrica: see where every gift goes', template: '%s | FundAfrica' },
  description:
    'A portfolio demo of a crowdfunding site for community projects across Africa. Every campaign publishes a line-by-line budget. No real money moves.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0f161b' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <a href="#main" className="sr-only-focus btn btn-primary">Skip to content</a>
          <SiteHeader />
          <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-10">
            {children}
          </main>
          <SiteFooter />
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
