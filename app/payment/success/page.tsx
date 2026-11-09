'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatDate, formatMoney } from '@/lib/logic'
import { Empty } from '@/components/ui'

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-ink-3">Loading receipt…</p>}>
      <Receipt />
    </Suspense>
  )
}

function Receipt() {
  const ref = useSearchParams().get('ref')
  const donation = useStore((s) => s.donations.find((d) => d.reference === ref))
  const campaign = useStore((s) => s.campaigns.find((c) => c.id === donation?.campaignId))
  const hydrated = useStore((s) => s.hydrated)

  if (!donation || !campaign) {
    return hydrated ? <Empty title="No receipt found" body="This receipt is saved in the browser where the gift was made." href="/explore" cta="Browse campaigns" /> : <p className="py-16 text-center text-ink-3">Loading receipt…</p>
  }
  return (
    <div className="mx-auto max-w-lg">
      <p className="flex items-center gap-2 font-semibold text-brand"><Check size={18} strokeWidth={3} aria-hidden /> Demo gift recorded</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Thank you, {donation.anonymous ? 'friend' : donation.name.split(' ')[0]}.</h1>
      <p className="mt-3 text-ink-2">Your gift now appears in the campaign ledger. No money moved: this is a simulation.</p>

      <dl className="mt-8 divide-y divide-line border-y border-line">
        {[
          ['Campaign', campaign.title],
          ['Amount', formatMoney(donation.amount, donation.currency)],
          ['Date', formatDate(donation.createdAt)],
          ['Method', donation.method.replace('_', ' ')],
          ['Reference', donation.reference],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 py-3">
            <dt className="text-ink-3">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/campaign/${campaign.id}`} className="btn btn-primary">See the ledger</Link>
        <Link href="/explore" className="btn btn-quiet">Find another campaign</Link>
      </div>
    </div>
  )
}
