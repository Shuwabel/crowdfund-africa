'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BudgetLedger } from '@/components/ledger'
import { CampaignRow, Meter, useCampaignStats } from '@/components/ui'
import { formatMoney, goalOf, percentFunded } from '@/lib/logic'

export default function HomePage() {
  const campaigns = useStore((s) => s.campaigns)
  const featured = campaigns.find((c) => c.id === 'ugwuoba-clinic-solar') ?? campaigns[0]
  const latest = campaigns.filter((c) => c.id !== featured.id).slice(0, 4)
  return (
    <div className="space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rise">
          <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl">Give to a project. Then follow the receipts.</h1>
          <p className="mt-5 max-w-lg text-lg text-ink-2">
            Every campaign here publishes its budget line by line. As gifts arrive they fill those lines in order, and each milestone unlocks only when its money is in.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/explore" className="btn btn-primary">Browse campaigns <ArrowRight size={17} aria-hidden /></Link>
            <Link href="/create" className="btn btn-quiet">Start a campaign</Link>
          </div>
        </div>
        <FeaturedLedger id={featured.id} />
      </section>

      <section aria-labelledby="how" className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <h2 id="how" className="text-3xl">How a gift is traced</h2>
        <ol className="divide-y divide-line border-y border-line">
          {[
            ['The budget is public before anyone gives.', 'Organisers list what they will buy and what each item costs. The goal is the sum of those lines, nothing more.'],
            ['Gifts fill the lines in order.', 'You can see which items are funded, which are part-way, and which are still open.'],
            ['Milestones unlock as money arrives.', 'Work on a step starts when its funding is in, and organisers post updates and receipts against it.'],
          ].map(([t, b], i) => (
            <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 py-5">
              <span className="font-serif text-2xl text-gold">{i + 1}</span>
              <div>
                <h3 className="text-lg">{t}</h3>
                <p className="mt-1 text-ink-2">{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="latest">
        <div className="flex items-end justify-between gap-4">
          <h2 id="latest" className="text-3xl">Open now</h2>
          <Link href="/explore" className="btn btn-text">See all <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div className="mt-2 divide-y divide-line border-y border-line">
          {latest.map((c) => <CampaignRow key={c.id} campaign={c} />)}
        </div>
      </section>

      <section className="rounded-[var(--radius)] bg-brand px-6 py-10 text-on-brand sm:px-10">
        <h2 className="max-w-xl text-3xl">Have a project your community needs?</h2>
        <p className="mt-3 max-w-xl opacity-90">Write the budget first. Everything else, the goal, the milestones and the progress view, follows from it.</p>
        <Link href="/create" className="btn mt-6 bg-on-brand text-brand hover:opacity-90">Start a campaign</Link>
      </section>
    </div>
  )
}

function FeaturedLedger({ id }: { id: string }) {
  const campaign = useStore((s) => s.campaigns.find((c) => c.id === id))!
  const { raised, count } = useCampaignStats(id)
  const goal = goalOf(campaign)
  const pct = percentFunded(raised, goal)
  return (
    <aside className="rise rounded-[var(--radius)] bg-raise p-5 shadow-[0_1px_0_var(--line),0_18px_40px_-24px_rgba(23,34,43,0.35)] sm:p-7" style={{ animationDelay: '0.12s' }} aria-label="A campaign budget, as shown to donors">
      <p className="text-sm text-ink-3">Example budget · {campaign.place}</p>
      <h2 className="mt-1 text-xl">
        <Link href={`/campaign/${campaign.id}`} className="hover:underline">{campaign.title}</Link>
      </h2>
      <div className="mt-4"><BudgetLedger campaign={campaign} raised={raised} /></div>
      <div className="mt-5">
        <Meter percent={pct} />
        <p className="mt-2 text-sm text-ink-2">
          <strong className="text-ink">{formatMoney(raised, campaign.currency)}</strong> from {count} gifts · {pct}% funded
        </p>
      </div>
    </aside>
  )
}
