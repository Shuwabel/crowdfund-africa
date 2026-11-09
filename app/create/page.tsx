'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { CATEGORIES, CURRENCIES, budgetTotal, formatMoney, validateDraft, type CampaignDraft } from '@/lib/logic'
import { Field, PageTitle, useMe } from '@/components/ui'
import type { Category } from '@/lib/types'

const emptyDraft = (): CampaignDraft => ({
  title: '',
  summary: '',
  story: '',
  category: 'community',
  currency: 'NGN',
  place: '',
  deadline: '',
  budget: [{ label: '', amount: 0 }, { label: '', amount: 0 }],
})

export default function CreatePage() {
  const router = useRouter()
  const me = useMe()
  const createCampaign = useStore((s) => s.createCampaign)
  const hydrated = useStore((s) => s.hydrated)
  const [d, setD] = useState<CampaignDraft>(emptyDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [minDate] = useState(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10))

  if (!hydrated) return <p className="py-16 text-center text-ink-3">Loading…</p>
  if (!me) {
    return (
      <div className="mx-auto max-w-md py-8">
        <PageTitle title="Start a campaign" lede="Sign in with a demo account first. It takes one tap." />
        <Link href="/auth/login?next=/create" className="btn btn-primary">Sign in</Link>
      </div>
    )
  }

  const total = budgetTotal(d.budget)
  const setLine = (i: number, patch: Partial<{ label: string; amount: number }>) =>
    setD({ ...d, budget: d.budget.map((l, j) => (j === i ? { ...l, ...patch } : l)) })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateDraft(d, Date.now())
    setErrors(errs)
    if (Object.keys(errs).length) {
      setFormError('Fix the highlighted fields and publish again.')
      return
    }
    const r = createCampaign(d)
    if (r.ok) router.push(`/campaign/${r.id}`)
    else setFormError(r.error)
  }

  return (
    <div className="max-w-2xl">
      <PageTitle title="Start a campaign" lede="Write the budget first. Your goal is simply its total, so donors see exactly what it pays for." />
      <form onSubmit={submit} noValidate className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="mb-2 font-serif text-2xl font-semibold">The project</legend>
          <Field id="title" label="Title" error={errors.title}>
            <input id="title" className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} aria-invalid={!!errors.title} />
          </Field>
          <Field id="summary" label="One-paragraph summary" error={errors.summary} hint="Shown on listing pages.">
            <textarea id="summary" className="field min-h-20" value={d.summary} onChange={(e) => setD({ ...d, summary: e.target.value })} aria-invalid={!!errors.summary} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="category" label="Cause">
              <select id="category" className="field" value={d.category} onChange={(e) => setD({ ...d, category: e.target.value as Category })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field id="place" label="Town or region" error={errors.place}>
              <input id="place" className="field" value={d.place} onChange={(e) => setD({ ...d, place: e.target.value })} aria-invalid={!!errors.place} />
            </Field>
            <Field id="currency" label="Currency">
              <select id="currency" className="field" value={d.currency} onChange={(e) => setD({ ...d, currency: e.target.value })}>
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.label}</option>)}
              </select>
            </Field>
            <Field id="deadline" label="Closing date" error={errors.deadline}>
              <input id="deadline" type="date" min={minDate} className="field" value={d.deadline} onChange={(e) => setD({ ...d, deadline: e.target.value })} aria-invalid={!!errors.deadline} />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1 font-serif text-2xl font-semibold">The budget</legend>
          <p className="mb-3 text-ink-2">One line for each thing you will buy or pay for.</p>
          <ul className="space-y-3">
            {d.budget.map((l, i) => (
              <li key={i} className="grid grid-cols-[1fr_7.5rem_2.75rem] items-start gap-2 sm:grid-cols-[1fr_10rem_2.75rem]">
                <input aria-label={`Budget line ${i + 1} description`} className="field" placeholder="e.g. Water tank" value={l.label} onChange={(e) => setLine(i, { label: e.target.value })} />
                <input aria-label={`Budget line ${i + 1} amount`} className="field" inputMode="numeric" placeholder="Amount" value={l.amount || ''} onChange={(e) => setLine(i, { amount: Number(e.target.value.replace(/[^\d]/g, '')) })} />
                <button type="button" className="btn btn-quiet !px-0" aria-label={`Remove budget line ${i + 1}`} disabled={d.budget.length <= 2} onClick={() => setD({ ...d, budget: d.budget.filter((_, j) => j !== i) })}>
                  <X size={18} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {errors.budget && <p className="error" role="alert">{errors.budget}</p>}
          <button type="button" className="btn btn-text mt-2" onClick={() => setD({ ...d, budget: [...d.budget, { label: '', amount: 0 }] })}>
            <Plus size={16} aria-hidden /> Add a line
          </button>
          <div className="ledger-row mt-3 border-t border-line pt-3 text-lg" aria-live="polite">
            <span className="font-serif font-semibold">Goal</span><span className="dots" aria-hidden /><span className="font-semibold">{formatMoney(total, d.currency)}</span>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-serif text-2xl font-semibold">The story</legend>
          <Field id="story" label="Who is this for and why now?" error={errors.story} hint="Leave a blank line between paragraphs.">
            <textarea id="story" className="field min-h-44" value={d.story} onChange={(e) => setD({ ...d, story: e.target.value })} aria-invalid={!!errors.story} />
          </Field>
        </fieldset>

        {formError && <p className="error" role="alert">{formError}</p>}
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Publish campaign</button>
        <p className="hint">Saved to this browser only. Nothing is sent to a server.</p>
      </form>
    </div>
  )
}
