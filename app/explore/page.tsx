'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { CATEGORIES, searchCampaigns } from '@/lib/logic'
import type { Category } from '@/lib/types'
import { CampaignRow, Empty, PageTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
  const campaigns = useStore((s) => s.campaigns)
  const donations = useStore((s) => s.donations)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<'new' | 'funded' | 'closing'>('new')

  const results = useMemo(() => {
    const raised: Record<string, number> = {}
    for (const d of donations) raised[d.campaignId] = (raised[d.campaignId] ?? 0) + d.amount
    return searchCampaigns(campaigns, { q, category, sort }, raised)
  }, [campaigns, donations, q, category, sort])

  return (
    <div>
      <PageTitle title="Explore campaigns" lede="Each one shows its full budget. Pick a cause, or search by town or country." />

      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <label htmlFor="q" className="sr-only">Search campaigns</label>
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
          <input id="q" type="search" className="field !pl-10" placeholder="Search by place, cause or title" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">Sort</label>
          <select id="sort" className="field" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="new">Newest first</option>
            <option value="funded">Most funded</option>
            <option value="closing">Closing soonest</option>
          </select>
        </div>
      </div>

      <div role="group" aria-label="Filter by cause" className="-mx-4 mt-4 flex gap-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ id: 'all' as const, label: 'All' }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              'shrink-0 border-b-2 py-2 text-[0.95rem] font-medium',
              category === c.id ? 'border-brand text-ink' : 'border-transparent text-ink-3 hover:text-ink'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-3" aria-live="polite">{results.length} {results.length === 1 ? 'campaign' : 'campaigns'}</p>

      {results.length === 0 ? (
        <Empty title="Nothing matches yet" body="Try a different cause or clear the search. Or start the campaign this place is missing." href="/create" cta="Start a campaign" />
      ) : (
        <div className="mt-1 divide-y divide-line border-y border-line">
          {results.map((c) => <CampaignRow key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  )
}
