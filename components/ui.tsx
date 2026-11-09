'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { categoryLabel, formatCompact, formatDay, formatMoney, goalOf, percentFunded } from '@/lib/logic'
import type { Campaign } from '@/lib/types'
import { cn } from '@/lib/utils'

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Terrain-style cover drawn from the campaign id, so no stock photos are needed. */
export function ContourArt({ seed, className }: { seed: string; className?: string }) {
  const paths = useMemo(() => {
    const h = hash(seed)
    const cx = 120 + (h % 160)
    const cy = 70 + ((h >> 8) % 100)
    const a1 = 0.06 + ((h >> 4) % 10) / 100
    const a2 = 0.04 + ((h >> 12) % 8) / 100
    const p1 = ((h >> 16) % 628) / 100
    const p2 = ((h >> 20) % 628) / 100
    const out: string[] = []
    for (let i = 1; i <= 15; i++) {
      const r = i * 17
      const pts: string[] = []
      for (let k = 0; k <= 72; k++) {
        const t = (k / 72) * Math.PI * 2
        const wob = 1 + a1 * Math.sin(3 * t + p1 + i * 0.18) + a2 * Math.sin(5 * t + p2 - i * 0.12)
        const x = cx + Math.cos(t) * r * wob * 1.35
        const y = cy + Math.sin(t) * r * wob * 0.8
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
      }
      out.push(`M${pts.join('L')}Z`)
    }
    return out
  }, [seed])
  const mix = 25 + (hash(seed) % 55)
  const stroke = `color-mix(in oklab, var(--brand) ${100 - mix}%, var(--gold))`
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full bg-paper-2', className)}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={i % 5 === 4 ? 1.6 : 0.9} opacity={0.4 + (i / 15) * 0.6} />
      ))}
    </svg>
  )
}

export function useCampaignStats(campaignId: string) {
  const donations = useStore((s) => s.donations)
  return useMemo(() => {
    const mine = donations.filter((d) => d.campaignId === campaignId)
    return { raised: mine.reduce((a, d) => a + d.amount, 0), count: mine.length, donations: mine }
  }, [donations, campaignId])
}

/** One thin bar. Raised, goal and share are always stated in text next to it. */
export function Meter({ percent, className }: { percent: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Share of budget funded"
      className={cn('h-2 w-full overflow-hidden rounded-[2px] bg-paper-2 shadow-[inset_0_0_0_1px_var(--line)]', className)}
    >
      <div className="fill h-full bg-brand" style={{ width: `${percent}%` }} />
    </div>
  )
}

export function CampaignRow({ campaign, featured = false }: { campaign: Campaign; featured?: boolean }) {
  const { raised, count } = useCampaignStats(campaign.id)
  const goal = goalOf(campaign)
  const pct = percentFunded(raised, goal)
  return (
    <article className={cn('group relative grid gap-4 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6', featured && 'sm:grid-cols-[minmax(0,22rem)_1fr]')}>
      <div className="aspect-[5/3] overflow-hidden rounded-[var(--radius)]">
        <ContourArt seed={campaign.id} className="transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-sm text-ink-3">
          {categoryLabel(campaign.category)} · {campaign.place}
        </p>
        <h3 className={cn('mt-1 text-xl sm:text-[1.35rem]', featured && 'sm:text-3xl')}>
          <Link href={`/campaign/${campaign.id}`} className="after:absolute after:inset-0 hover:underline">
            {campaign.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-ink-2">{campaign.summary}</p>
        <div className="mt-auto pt-4">
          <Meter percent={pct} />
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
            <span>
              <strong className="font-semibold">{formatMoney(raised, campaign.currency)}</strong>{' '}
              <span className="text-ink-3">of {formatCompact(goal, campaign.currency)} · {pct}%</span>
            </span>
            <span className="text-ink-3">
              {count} {count === 1 ? 'gift' : 'gifts'} · closes {formatDay(campaign.deadline)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-paper-2', className)} />
}

export function Empty({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="rule py-12 text-center">
      <h3 className="text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-ink-2">{body}</p>
      {href && cta && (
        <Link href={href} className="btn btn-primary mt-5">
          {cta} <ArrowUpRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  )
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="hint mt-1">{hint}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  )
}

export function PageTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="mb-8 max-w-2xl">
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 text-lg text-ink-2">{lede}</p>}
    </header>
  )
}

export function useMe() {
  const id = useStore((s) => s.currentUserId)
  return useStore((s) => s.users.find((u) => u.id === id) ?? null)
}
