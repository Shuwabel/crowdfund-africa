'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { Empty, PageTitle, useMe } from '@/components/ui'
import { formatDate } from '@/lib/logic'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const me = useMe()
  const hydrated = useStore((s) => s.hydrated)
  const all = useStore((s) => s.notifications)
  const markAllRead = useStore((s) => s.markAllRead)
  const list = useMemo(
    () => all.filter((n) => n.userId === me?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all, me]
  )

  if (!hydrated) return <p className="py-16 text-center text-ink-3">Loading…</p>
  if (!me) {
    return (
      <div className="mx-auto max-w-md py-8">
        <PageTitle title="Alerts" lede="Sign in to hear about gifts and comments on your campaigns." />
        <Link href="/auth/login?next=/notifications" className="btn btn-primary">Sign in</Link>
      </div>
    )
  }
  const unread = list.filter((n) => !n.read).length
  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <PageTitle title="Alerts" lede={unread ? `${unread} unread` : 'You are up to date.'} />
        {unread > 0 && <button type="button" className="btn btn-quiet" onClick={markAllRead}>Mark all read</button>}
      </div>
      {list.length === 0 ? (
        <Empty title="Nothing yet" body="When someone gives to or comments on your campaign, it shows up here." href="/create" cta="Start a campaign" />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {list.map((n) => (
            <li key={n.id}>
              <Link href={n.href} className="flex items-start gap-3 py-4 hover:bg-paper-2">
                <span aria-hidden className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-gold')} />
                <span>
                  <span className={cn('block', !n.read && 'font-semibold')}>{n.text}</span>
                  <span className="block text-sm text-ink-3">{formatDate(n.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
