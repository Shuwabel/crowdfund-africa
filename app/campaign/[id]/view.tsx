'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BudgetLedger, MilestoneList } from '@/components/ledger'
import { ContourArt, Empty, Meter, useCampaignStats, useMe } from '@/components/ui'
import { categoryLabel, formatDate, formatMoney, goalOf, nextMilestone, percentFunded } from '@/lib/logic'

export function CampaignView({ id }: { id: string }) {
  const campaign = useStore((s) => s.campaigns.find((c) => c.id === id))
  const organizer = useStore((s) => s.users.find((u) => u.id === campaign?.organizerId))
  const { raised, count, donations } = useCampaignStats(id)
  const hydrated = useStore((s) => s.hydrated)

  if (!campaign) {
    return hydrated ? (
      <Empty title="Campaign not found" body="It may have been removed, or saved only in another browser." href="/explore" cta="Browse campaigns" />
    ) : (
      <p className="py-16 text-center text-ink-3">Loading campaign…</p>
    )
  }

  const goal = goalOf(campaign)
  const pct = percentFunded(raised, goal)
  const next = nextMilestone(campaign.milestones, raised)
  const donateHref = `/donate/${campaign.id}`

  return (
    <div>
      <Link href="/explore" className="btn btn-text -ml-1"><ArrowLeft size={16} aria-hidden /> All campaigns</Link>

      <div className="mt-3 aspect-[5/2] overflow-hidden rounded-[var(--radius)]">
        <ContourArt seed={campaign.id} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-12">
          <header>
            <p className="text-sm text-ink-3">{categoryLabel(campaign.category)} · {campaign.place}, {campaign.country}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{campaign.title}</h1>
            <p className="mt-4 text-lg text-ink-2">{campaign.summary}</p>
            <p className="mt-3 text-sm text-ink-3">
              Organised by <strong className="font-semibold text-ink-2">{organizer?.name ?? 'a community member'}</strong> · started {formatDate(campaign.createdAt)} · closes {formatDate(campaign.deadline)}
            </p>
          </header>

          <section aria-labelledby="funding" className="lg:hidden">
            <FundingPanel campaignId={id} />
          </section>

          <section aria-labelledby="budget">
            <h2 id="budget" className="text-2xl">Where the money goes</h2>
            <p className="mb-4 mt-1 text-ink-2">Gifts fill these lines from the top. The goal is the total of the lines.</p>
            <BudgetLedger campaign={campaign} raised={raised} />
          </section>

          <section aria-labelledby="milestones">
            <h2 id="milestones" className="mb-4 text-2xl">Milestones</h2>
            <MilestoneList campaign={campaign} raised={raised} />
            {next && <p className="mt-5 text-sm text-ink-2">Next unlock: <strong>{next.title}</strong>, {formatMoney(next.at - raised, campaign.currency)} away.</p>}
          </section>

          <section aria-labelledby="story">
            <h2 id="story" className="mb-4 text-2xl">The story</h2>
            <div className="max-w-[68ch] space-y-4 text-[1.05rem] leading-relaxed text-ink-2">
              {campaign.story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          <section aria-labelledby="updates">
            <h2 id="updates" className="mb-4 text-2xl">Updates</h2>
            {campaign.updates.length === 0 ? (
              <p className="text-ink-2">No updates yet. The organiser posts here as money is spent.</p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {[...campaign.updates].reverse().map((u) => (
                  <li key={u.id} className="py-4">
                    <p className="text-sm text-ink-3">{formatDate(u.date)}</p>
                    <h3 className="mt-0.5 text-lg">{u.title}</h3>
                    <p className="mt-1 text-ink-2">{u.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="donors">
            <h2 id="donors" className="mb-1 text-2xl">Gifts <span className="text-ink-3">({count})</span></h2>
            {count === 0 ? (
              <p className="mt-2 text-ink-2">No gifts yet. Yours would be the first line in the ledger.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {donations.slice(0, 12).map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="ledger-row">
                      <span className="font-medium">{d.name}</span>
                      <span className="dots" aria-hidden />
                      <span className="font-semibold">{formatMoney(d.amount, d.currency)}</span>
                    </div>
                    <p className="text-sm text-ink-3">{formatDate(d.createdAt)}{d.message ? ` · “${d.message}”` : ''}</p>
                  </li>
                ))}
              </ul>
            )}
            {count > 12 && <p className="mt-3 text-sm text-ink-3">Showing the latest 12 of {count}.</p>}
          </section>

          <Comments campaignId={id} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6"><FundingPanel campaignId={id} /></div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-line bg-paper/95 px-4 py-2.5 backdrop-blur md:bottom-0 lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="text-sm"><strong>{pct}%</strong> funded<span className="text-ink-3"> · {formatMoney(raised, campaign.currency)}</span></p>
          <Link href={donateHref} className="btn btn-primary">Give</Link>
        </div>
      </div>
    </div>
  )
}

function FundingPanel({ campaignId }: { campaignId: string }) {
  const campaign = useStore((s) => s.campaigns.find((c) => c.id === campaignId))!
  const { raised, count } = useCampaignStats(campaignId)
  const goal = goalOf(campaign)
  const pct = percentFunded(raised, goal)
  return (
    <div className="rounded-[var(--radius)] bg-raise p-5 shadow-[0_1px_0_var(--line),0_18px_40px_-26px_rgba(23,34,43,0.35)]">
      <p id="funding" className="font-serif text-3xl font-semibold">{formatMoney(raised, campaign.currency)}</p>
      <p className="text-sm text-ink-2">of {formatMoney(goal, campaign.currency)} · from {count} {count === 1 ? 'gift' : 'gifts'}</p>
      <Meter percent={pct} className="mt-4" />
      <p className="mt-2 text-sm font-medium">{pct}% of the budget is in</p>
      <Link href={`/donate/${campaign.id}`} className="btn btn-primary mt-5 w-full">Give to this campaign</Link>
      <p className="mt-3 text-xs text-ink-3">Demo checkout. No real money moves.</p>
    </div>
  )
}

function Comments({ campaignId }: { campaignId: string }) {
  const allComments = useStore((s) => s.comments)
  const comments = useMemo(() => allComments.filter((c) => c.campaignId === campaignId), [allComments, campaignId])
  const addComment = useStore((s) => s.addComment)
  const me = useMe()
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  return (
    <section aria-labelledby="comments">
      <h2 id="comments" className="mb-2 text-2xl">Questions and comments</h2>
      {comments.length > 0 ? (
        <ul className="divide-y divide-line border-y border-line">
          {comments.map((c) => (
            <li key={c.id} className="py-4">
              <p className="text-sm"><strong className="font-semibold">{c.name}</strong> <span className="text-ink-3">· {formatDate(c.createdAt)}</span></p>
              <p className="mt-1 text-ink-2">{c.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-2">Nobody has asked anything yet.</p>
      )}
      {me ? (
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault()
            const r = addComment(campaignId, body)
            if (r.ok) { setBody(''); setError('') } else setError(r.error)
          }}
        >
          <label htmlFor="comment" className="label">Add a comment as {me.name}</label>
          <textarea id="comment" className="field min-h-24" value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} aria-invalid={!!error} />
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary mt-3">Post comment</button>
        </form>
      ) : (
        <p className="mt-5 text-ink-2"><Link href="/auth/login" className="font-semibold text-brand underline">Sign in</Link> to join the conversation.</p>
      )}
    </section>
  )
}
