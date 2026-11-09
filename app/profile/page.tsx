'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useStore } from '@/lib/store'
import { CampaignRow, Empty, PageTitle, useMe } from '@/components/ui'
import { formatDate, formatMoney } from '@/lib/logic'

export default function ProfilePage() {
  const me = useMe()
  const hydrated = useStore((s) => s.hydrated)
  const logout = useStore((s) => s.logout)
  const campaigns = useStore((s) => s.campaigns)
  const donations = useStore((s) => s.donations)

  const mine = useMemo(() => campaigns.filter((c) => c.organizerId === me?.id), [campaigns, me])
  const given = useMemo(() => donations.filter((d) => d.donorId === me?.id), [donations, me])
  const byId = useMemo(() => new Map(campaigns.map((c) => [c.id, c])), [campaigns])

  if (!hydrated) return <p className="py-16 text-center text-ink-3">Loading…</p>
  if (!me) {
    return (
      <div className="mx-auto max-w-md py-8">
        <PageTitle title="Your profile" lede="Sign in to see your campaigns and gifts." />
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn btn-primary">Sign in</Link>
          <Link href="/auth/signup" className="btn btn-quiet">Create account</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">{me.name}</h1>
          <p className="mt-1 text-ink-2">{me.country} · {me.email}</p>
          {me.bio && <p className="mt-2 max-w-lg text-ink-2">{me.bio}</p>}
        </div>
        <button type="button" className="btn btn-quiet" onClick={logout}>Sign out</button>
      </header>

      <section aria-labelledby="mine">
        <div className="flex items-end justify-between gap-3">
          <h2 id="mine" className="text-2xl">Your campaigns</h2>
          <Link href="/create" className="btn btn-text">Start one</Link>
        </div>
        {mine.length === 0 ? (
          <Empty title="No campaigns yet" body="Write a budget and publish it in a few minutes." href="/create" cta="Start a campaign" />
        ) : (
          <div className="mt-2 divide-y divide-line border-y border-line">
            {mine.map((c) => <CampaignRow key={c.id} campaign={c} />)}
          </div>
        )}
      </section>

      <section aria-labelledby="given">
        <h2 id="given" className="text-2xl">Your gifts</h2>
        {given.length === 0 ? (
          <Empty title="No gifts yet" body="Gifts you make while signed in are listed here with their references." href="/explore" cta="Browse campaigns" />
        ) : (
          <>
            <p className="mt-1 text-ink-2">{given.length} {given.length === 1 ? 'gift' : 'gifts'} so far (demo money).</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {given.map((d) => (
                <li key={d.id} className="py-3">
                  <div className="ledger-row">
                    <Link href={`/campaign/${d.campaignId}`} className="min-w-0 truncate font-medium hover:underline">{byId.get(d.campaignId)?.title ?? 'Campaign'}</Link>
                    <span className="dots" aria-hidden />
                    <span className="font-semibold">{formatMoney(d.amount, d.currency)}</span>
                  </div>
                  <p className="text-sm text-ink-3">{formatDate(d.createdAt)} · {d.reference}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
