'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { allocate, formatMoney, suggestedAmounts, validateDonation, type DonationInput } from '@/lib/logic'
import { Empty, Field, useCampaignStats, useMe } from '@/components/ui'
import type { PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

const METHODS: { id: PaymentMethod; label: string; help: string }[] = [
  { id: 'card', label: 'Card', help: 'Visa or Mastercard' },
  { id: 'mobile_money', label: 'Mobile money', help: 'M-Pesa, MTN MoMo and similar' },
  { id: 'bank_transfer', label: 'Bank transfer', help: 'Pay from your banking app' },
]

export function DonateView({ id }: { id: string }) {
  const router = useRouter()
  const campaign = useStore((s) => s.campaigns.find((c) => c.id === id))
  const donate = useStore((s) => s.donate)
  const hydrated = useStore((s) => s.hydrated)
  const me = useMe()
  const { raised } = useCampaignStats(id)

  const [step, setStep] = useState<'details' | 'pay'>('details')
  const [paying, setPaying] = useState(false)
  const [form, setForm] = useState<DonationInput>({ amount: 0, name: '', anonymous: false, message: '', method: 'card' })
  const [errors, setErrors] = useState<Partial<Record<keyof DonationInput, string>>>({})
  const [failure, setFailure] = useState('')

  if (!campaign) {
    return hydrated ? (
      <Empty title="Campaign not found" body="Pick a campaign to give to." href="/explore" cta="Browse campaigns" />
    ) : (
      <p className="py-16 text-center text-ink-3">Loading…</p>
    )
  }

  const cur = campaign.currency
  const name = form.name || me?.name || ''
  const effective = { ...form, name }
  const lines = allocate(campaign.budget, raised)
  const reaching = lines.find((l) => l.funded < l.amount)

  function toPay(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateDonation(effective, cur)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep('pay')
  }

  async function pay() {
    setPaying(true)
    setFailure('')
    await new Promise((r) => setTimeout(r, 1400))
    const r = donate(campaign!.id, effective)
    if (r.ok) router.push(`/payment/success?ref=${encodeURIComponent(r.donation.reference)}`)
    else {
      setPaying(false)
      setFailure(r.error)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href={`/campaign/${campaign.id}`} className="btn btn-text -ml-1"><ArrowLeft size={16} aria-hidden /> Back to campaign</Link>
      <h1 className="mt-2 text-3xl">Give to {campaign.title}</h1>
      <p className="mt-2 text-ink-2">
        {reaching ? <>Your gift reaches <strong className="text-ink">{reaching.label}</strong> next.</> : 'This campaign has met its budget. Extra gifts go to the maintenance reserve the organiser lists.'}
      </p>

      {step === 'details' ? (
        <form onSubmit={toPay} noValidate className="mt-8 space-y-6">
          <fieldset>
            <legend className="label">Amount ({cur})</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {suggestedAmounts(cur).map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={form.amount === a}
                  onClick={() => setForm({ ...form, amount: a })}
                  className={cn('btn btn-quiet', form.amount === a && '!bg-brand !text-on-brand')}
                >
                  {formatMoney(a, cur)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="amount" className="sr-only">Other amount</label>
              <input id="amount" className="field" inputMode="numeric" placeholder="Or enter another amount" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value.replace(/[^\d]/g, '')) })} aria-invalid={!!errors.amount} />
              {errors.amount && <p className="error" role="alert">{errors.amount}</p>}
            </div>
          </fieldset>

          <Field id="name" label="Name shown with your gift" error={errors.name}>
            <input id="name" className="field" autoComplete="name" value={name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={form.anonymous} aria-invalid={!!errors.name} />
          </Field>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
            Give anonymously
          </label>
          <Field id="message" label="A note for the organiser (optional)" error={errors.message}>
            <textarea id="message" className="field min-h-20" maxLength={280} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>

          <fieldset>
            <legend className="label">How would you pay?</legend>
            <div className="divide-y divide-line border-y border-line">
              {METHODS.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center gap-3 py-3">
                  <input type="radio" name="method" className="h-5 w-5 accent-[var(--brand)]" checked={form.method === m.id} onChange={() => setForm({ ...form, method: m.id })} />
                  <span><span className="block font-medium">{m.label}</span><span className="block text-sm text-ink-3">{m.help}</span></span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full">Continue to demo checkout</button>
        </form>
      ) : (
        <div className="mt-8 rounded-[var(--radius)] bg-raise p-5 shadow-[0_1px_0_var(--line),0_18px_40px_-26px_rgba(23,34,43,0.35)]">
          <p className="flex items-center gap-2 text-sm font-semibold text-gold"><Lock size={15} aria-hidden /> Demo checkout. Nothing is charged.</p>
          <p className="mt-3 text-ink-2">Gift to {campaign.title}</p>
          <p className="font-serif text-4xl font-semibold">{formatMoney(form.amount, cur)}</p>

          <div className="mt-5 space-y-3">
            {form.method === 'card' && (
              <>
                <Field id="cn" label="Card number"><input id="cn" className="field" readOnly value="4111 1111 1111 1111" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="ce" label="Expiry"><input id="ce" className="field" readOnly value="12 / 30" /></Field>
                  <Field id="cc" label="CVV"><input id="cc" className="field" readOnly value="123" /></Field>
                </div>
              </>
            )}
            {form.method === 'mobile_money' && (
              <>
                <Field id="mp" label="Mobile number"><input id="mp" className="field" readOnly value="+254 700 000 000" /></Field>
                <p className="hint">In a live checkout you would approve a prompt on your phone. Here the approval is simulated.</p>
              </>
            )}
            {form.method === 'bank_transfer' && (
              <div>
                <p className="label">Transfer details</p>
                <p className="ledger-row"><span>Account</span><span className="dots" /><span>0000 000 000</span></p>
                <p className="ledger-row"><span>Reference</span><span className="dots" /><span>DEMO-PENDING</span></p>
                <p className="hint mt-2">Sample details only. The transfer is simulated.</p>
              </div>
            )}
          </div>

          {failure && <p className="error" role="alert">{failure}</p>}
          <button type="button" className="btn btn-primary mt-6 w-full" onClick={pay} disabled={paying}>
            {paying ? <><Loader2 size={17} className="animate-spin" aria-hidden /> Processing…</> : `Pay ${formatMoney(form.amount, cur)}`}
          </button>
          <button type="button" className="btn btn-text mt-2 w-full" onClick={() => setStep('details')} disabled={paying}>Change details</button>
        </div>
      )}
    </div>
  )
}
