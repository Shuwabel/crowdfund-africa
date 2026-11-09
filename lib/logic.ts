import type { BudgetLine, Campaign, Category, Donation, Milestone, PaymentMethod } from './types'

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'health', label: 'Health' },
  { id: 'education', label: 'Education' },
  { id: 'water', label: 'Water and sanitation' },
  { id: 'farming', label: 'Farming' },
  { id: 'business', label: 'Small business' },
  { id: 'community', label: 'Community' },
]

export const CURRENCIES = [
  { code: 'NGN', label: 'Nigerian naira', country: 'Nigeria' },
  { code: 'KES', label: 'Kenyan shilling', country: 'Kenya' },
  { code: 'GHS', label: 'Ghanaian cedi', country: 'Ghana' },
  { code: 'ZAR', label: 'South African rand', country: 'South Africa' },
  { code: 'UGX', label: 'Ugandan shilling', country: 'Uganda' },
  { code: 'RWF', label: 'Rwandan franc', country: 'Rwanda' },
  { code: 'ETB', label: 'Ethiopian birr', country: 'Ethiopia' },
]

export function categoryLabel(c: Category) {
  return CATEGORIES.find((x) => x.id === c)?.label ?? c
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString('en')}`
  }
}

/** Compact form for tight spaces, e.g. ₦1.2M */
export function formatCompact(amount: number, currency: string) {
  const sym = formatMoney(0, currency).replace(/[\d.,\s]/g, '')
  const n = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(amount)
  return `${sym}${n}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

export function budgetTotal(lines: { amount: number }[]) {
  return lines.reduce((s, l) => s + (Number.isFinite(l.amount) ? l.amount : 0), 0)
}

/** A campaign's goal is always the sum of its published budget lines. */
export function goalOf(c: Pick<Campaign, 'budget'>) {
  return budgetTotal(c.budget)
}

export function raisedOf(campaignId: string, donations: Donation[]) {
  return donations.filter((d) => d.campaignId === campaignId).reduce((s, d) => s + d.amount, 0)
}

export function donorCountOf(campaignId: string, donations: Donation[]) {
  return donations.filter((d) => d.campaignId === campaignId).length
}

export function percentFunded(raised: number, goal: number) {
  if (goal <= 0) return 0
  if (raised <= 0) return 0
  // a real gift never reads as 0%
  return Math.min(100, Math.max(1, Math.floor((raised / goal) * 100)))
}

export function milestoneReached(m: Milestone, raised: number) {
  return raised >= m.at
}

export function nextMilestone(milestones: Milestone[], raised: number) {
  return [...milestones].sort((a, b) => a.at - b.at).find((m) => raised < m.at) ?? null
}

/**
 * Pours the money raised into the budget lines in order, so a reader can see
 * which line is funded, which is partly funded and which is still open.
 */
export function allocate(budget: BudgetLine[], raised: number) {
  let left = raised
  return budget.map((line) => {
    const funded = Math.max(0, Math.min(line.amount, left))
    left -= funded
    return { ...line, funded }
  })
}

export function isOpen(c: Pick<Campaign, 'deadline'>, now: number) {
  return new Date(c.deadline).getTime() >= now
}

/** Demo minimums scaled so each currency has a roughly equal small gift. */
export function minDonation(currency: string) {
  const table: Record<string, number> = { NGN: 500, KES: 50, GHS: 10, ZAR: 20, UGX: 2000, RWF: 500, ETB: 50 }
  return table[currency] ?? 10
}

export function maxDonation(currency: string) {
  return minDonation(currency) * 20000
}

export function suggestedAmounts(currency: string) {
  const base = minDonation(currency)
  return [base * 4, base * 10, base * 40, base * 100]
}

export interface DonationInput {
  amount: number
  name: string
  anonymous: boolean
  message: string
  method: PaymentMethod
}

export function validateDonation(input: DonationInput, currency: string) {
  const errors: Partial<Record<keyof DonationInput, string>> = {}
  const min = minDonation(currency)
  if (!Number.isFinite(input.amount) || input.amount < min) {
    errors.amount = `The smallest gift is ${formatMoney(min, currency)}.`
  } else if (input.amount > maxDonation(currency)) {
    errors.amount = 'That is above the demo limit.'
  }
  if (!input.anonymous && input.name.trim().length < 2) {
    errors.name = 'Add your name, or choose to give anonymously.'
  }
  if (input.message.length > 280) errors.message = 'Keep the note under 280 characters.'
  return errors
}

export function makeReference(seed: number) {
  const s = Math.abs(Math.floor(seed)).toString(36).toUpperCase().padStart(8, '0').slice(-8)
  return `DEMO-${s}`
}

export interface CampaignDraft {
  title: string
  summary: string
  story: string
  category: Category
  currency: string
  place: string
  deadline: string
  budget: { label: string; amount: number }[]
}

export function validateDraft(d: CampaignDraft, now: number) {
  const errors: Record<string, string> = {}
  if (d.title.trim().length < 8) errors.title = 'Give the campaign a title of at least 8 characters.'
  if (d.summary.trim().length < 20) errors.summary = 'Summarise the project in at least 20 characters.'
  if (d.story.trim().length < 80) errors.story = 'Tell the story in at least 80 characters.'
  if (d.place.trim().length < 2) errors.place = 'Add the town or region.'
  const lines = d.budget.filter((l) => l.label.trim() && l.amount > 0)
  if (lines.length < 2) errors.budget = 'List at least two budget lines, each with an amount.'
  const t = new Date(d.deadline).getTime()
  if (!d.deadline || Number.isNaN(t) || t <= now) errors.deadline = 'Pick a closing date in the future.'
  return errors
}

export function searchCampaigns(
  campaigns: Campaign[],
  opts: { q?: string; category?: Category | 'all'; sort?: 'new' | 'funded' | 'closing' },
  raisedMap: Record<string, number>
) {
  const q = (opts.q ?? '').trim().toLowerCase()
  const list = campaigns.filter((c) => {
    if (opts.category && opts.category !== 'all' && c.category !== opts.category) return false
    if (!q) return true
    return [c.title, c.summary, c.place, c.country].join(' ').toLowerCase().includes(q)
  })
  const sort = opts.sort ?? 'new'
  return list.sort((a, b) => {
    if (sort === 'funded') {
      return percentFunded(raisedMap[b.id] ?? 0, goalOf(b)) - percentFunded(raisedMap[a.id] ?? 0, goalOf(a))
    }
    if (sort === 'closing') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
