'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Bell, Compass, Home, Moon, PlusCircle, Sun, User } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none">
        <path d="M2 5h18M2 11h13M2 17h8" stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18.5" cy="17" r="2" fill="var(--gold)" />
      </svg>
      <span className="font-serif text-xl font-semibold tracking-tight">FundAfrica</span>
    </span>
  )
}

const noop = () => () => {}
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false)
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const dark = mounted && resolvedTheme === 'dark'
  return (
    <button
      type="button"
      className="btn btn-quiet !min-h-10 !w-10 !px-0"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  )
}

function useUnread() {
  const n = useStore((s) => s.notifications)
  const me = useStore((s) => s.currentUserId)
  return n.filter((x) => x.userId === me && !x.read).length
}

const links = [
  { href: '/explore', label: 'Explore' },
  { href: '/create', label: 'Start a campaign' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const me = useStore((s) => s.users.find((u) => u.id === s.currentUserId))
  const unread = useUnread()
  return (
    <header className="border-b border-line bg-paper">
      <div className="bg-paper-2 px-4 py-1.5 text-center text-[0.8rem] text-ink-2">
        Portfolio demo. Sample campaigns are fictional and no money moves.
      </div>
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="FundAfrica home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? 'page' : undefined}
              className={cn(
                'rounded px-3 py-2 text-[0.95rem] font-medium text-ink-2 hover:text-ink',
                pathname.startsWith(l.href) && 'text-ink underline decoration-brand decoration-2 underline-offset-8'
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/notifications" className="relative rounded px-3 py-2 text-[0.95rem] font-medium text-ink-2 hover:text-ink">
            Alerts{unread > 0 && <span className="ml-1.5 text-gold" aria-label={`${unread} unread`}>({unread})</span>}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {me ? (
            <Link href="/profile" className="btn btn-quiet !min-h-10 hidden md:inline-flex">{me.name.split(' ')[0]}</Link>
          ) : (
            <Link href="/auth/login" className="btn btn-primary !min-h-10 hidden md:inline-flex">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/create', label: 'Start', icon: PlusCircle },
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Me', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const unread = useUnread()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn('relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.72rem] font-medium', active ? 'text-brand' : 'text-ink-3')}
              >
                <Icon size={21} aria-hidden strokeWidth={active ? 2.4 : 1.8} />
                {label}
                {href === '/notifications' && unread > 0 && (
                  <span className="absolute right-[28%] top-2 h-2 w-2 rounded-full bg-gold" aria-label={`${unread} unread`} />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2 px-4 py-8 pb-28 text-sm text-ink-2 md:pb-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl">
          FundAfrica is a portfolio project. Campaigns, people and totals are made up, and checkout is a simulation. Your actions are saved only in this browser.
        </p>
        <ResetButton />
      </div>
    </footer>
  )
}

function ResetButton() {
  const reset = useStore((s) => s.resetDemo)
  return (
    <button type="button" className="btn btn-quiet self-start" onClick={() => { if (confirm('Reset all demo data in this browser?')) reset() }}>
      Reset demo data
    </button>
  )
}
