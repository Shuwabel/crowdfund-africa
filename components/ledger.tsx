import { Check } from 'lucide-react'
import { allocate, formatMoney, goalOf, milestoneReached } from '@/lib/logic'
import type { Campaign } from '@/lib/types'
import { cn } from '@/lib/utils'

/** The budget as a ledger: every line, what has reached it, and what is still open. */
export function BudgetLedger({ campaign, raised }: { campaign: Campaign; raised: number }) {
  const lines = allocate(campaign.budget, raised)
  const goal = goalOf(campaign)
  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {lines.map((l) => {
          const full = l.funded >= l.amount
          const partial = !full && l.funded > 0
          return (
            <li key={l.id} className="py-3.5">
              <div className="ledger-row">
                <span className={cn('min-w-0 max-w-[70%] font-medium', !full && !partial && 'text-ink-2')}>{l.label}</span>
                <span className="dots" aria-hidden />
                <span className="shrink-0 font-semibold">{formatMoney(l.amount, campaign.currency)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3 text-sm">
                <span className={cn('inline-flex items-center gap-1.5', full ? 'text-brand' : partial ? 'text-gold' : 'text-ink-3')}>
                  {full && <Check size={14} strokeWidth={3} aria-hidden />}
                  {full ? 'Funded' : partial ? `${formatMoney(l.funded, campaign.currency)} reached so far` : 'Not yet reached'}
                </span>
                {partial && (
                  <span className="relative h-1.5 w-24 overflow-hidden rounded-[2px] bg-paper-2 shadow-[inset_0_0_0_1px_var(--line)]" aria-hidden>
                    <span className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${Math.round((l.funded / l.amount) * 100)}%` }} />
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="ledger-row pt-4 text-lg">
        <span className="font-serif font-semibold">Goal</span>
        <span className="dots" aria-hidden />
        <span className="font-semibold">{formatMoney(goal, campaign.currency)}</span>
      </div>
    </div>
  )
}

export function MilestoneList({ campaign, raised }: { campaign: Campaign; raised: number }) {
  const sorted = [...campaign.milestones].sort((a, b) => a.at - b.at)
  const nextIdx = sorted.findIndex((m) => !milestoneReached(m, raised))
  return (
    <ol className="relative ml-2 border-l border-line">
      {sorted.map((m, i) => {
        const reached = milestoneReached(m, raised)
        const current = i === nextIdx
        return (
          <li key={m.id} className="relative pb-6 pl-6 last:pb-0">
            <span
              aria-hidden
              className={cn(
                'absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-paper',
                reached ? 'bg-brand' : current ? 'bg-gold' : 'bg-line'
              )}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h4 className="font-semibold">{m.title}</h4>
              <span className="text-sm text-ink-3">at {formatMoney(m.at, campaign.currency)}</span>
            </div>
            <p className="mt-0.5 text-[0.95rem] text-ink-2">{m.note}</p>
            <p className={cn('mt-1 text-sm font-medium', reached ? 'text-brand' : current ? 'text-gold' : 'text-ink-3')}>
              {reached ? 'Reached' : current ? `Next: ${formatMoney(m.at - raised, campaign.currency)} to go` : 'Locked'}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
