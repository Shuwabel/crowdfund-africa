import { beforeEach, describe, expect, it, vi } from 'vitest'
import { allocate, budgetTotal, goalOf, minDonation, nextMilestone, percentFunded, raisedOf, searchCampaigns, validateDonation, validateDraft } from '@/lib/logic'
import { SEED_CAMPAIGNS, SEED_DONATIONS } from '@/lib/seed'

const budget = [
  { id: 'a', label: 'A', amount: 100 },
  { id: 'b', label: 'B', amount: 200 },
  { id: 'c', label: 'C', amount: 300 },
]

describe('budget and funding maths', () => {
  it('sums the goal from budget lines', () => {
    expect(budgetTotal(budget)).toBe(600)
    expect(goalOf({ budget })).toBe(600)
  })

  it('pours raised money into lines in order', () => {
    const r = allocate(budget, 250)
    expect(r.map((l) => l.funded)).toEqual([100, 150, 0])
    expect(allocate(budget, 10_000).map((l) => l.funded)).toEqual([100, 200, 300])
    expect(allocate(budget, 0).every((l) => l.funded === 0)).toBe(true)
  })

  it('caps percent at 100 and handles a zero goal', () => {
    expect(percentFunded(300, 600)).toBe(50)
    expect(percentFunded(900, 600)).toBe(100)
    expect(percentFunded(10, 0)).toBe(0)
    expect(percentFunded(0, 600)).toBe(0)
    expect(percentFunded(1, 600)).toBe(1)
  })

  it('finds the next milestone', () => {
    const ms = [
      { id: '1', title: 'one', at: 100, note: '' },
      { id: '2', title: 'two', at: 300, note: '' },
    ]
    expect(nextMilestone(ms, 50)?.id).toBe('1')
    expect(nextMilestone(ms, 100)?.id).toBe('2')
    expect(nextMilestone(ms, 300)).toBeNull()
  })
})

describe('donation validation', () => {
  const ok = { amount: 5000, name: 'Ada Obi', anonymous: false, message: '', method: 'card' as const }
  it('accepts a valid gift', () => {
    expect(validateDonation(ok, 'NGN')).toEqual({})
  })
  it('rejects gifts under the currency minimum', () => {
    expect(validateDonation({ ...ok, amount: minDonation('NGN') - 1 }, 'NGN').amount).toBeDefined()
    expect(validateDonation({ ...ok, amount: NaN }, 'NGN').amount).toBeDefined()
  })
  it('requires a name unless anonymous', () => {
    expect(validateDonation({ ...ok, name: '' }, 'NGN').name).toBeDefined()
    expect(validateDonation({ ...ok, name: '', anonymous: true }, 'NGN').name).toBeUndefined()
  })
})

describe('campaign draft validation', () => {
  const draft = {
    title: 'A well-named campaign',
    summary: 'This campaign pays for a very specific thing.',
    story: 'x'.repeat(90),
    category: 'health' as const,
    currency: 'KES',
    place: 'Kisumu',
    deadline: '2030-01-01',
    budget: [{ label: 'One', amount: 10 }, { label: 'Two', amount: 20 }],
  }
  it('passes a complete draft', () => {
    expect(validateDraft(draft, Date.UTC(2026, 0, 1))).toEqual({})
  })
  it('flags missing budget lines and past deadlines', () => {
    const e = validateDraft({ ...draft, budget: [{ label: 'One', amount: 10 }], deadline: '2020-01-01' }, Date.UTC(2026, 0, 1))
    expect(e.budget).toBeDefined()
    expect(e.deadline).toBeDefined()
  })
})

describe('seed data', () => {
  it('every seeded campaign has milestones within its goal', () => {
    for (const c of SEED_CAMPAIGNS) {
      const goal = goalOf(c)
      expect(c.milestones.at(-1)!.at).toBeLessThanOrEqual(goal)
    }
  })
  it('gifts total roughly the intended share of each goal and never exceed it', () => {
    for (const c of SEED_CAMPAIGNS) {
      const raised = raisedOf(c.id, SEED_DONATIONS)
      expect(raised).toBeGreaterThan(0)
      expect(raised).toBeLessThan(goalOf(c))
    }
  })
  it('searches and sorts', () => {
    const raised: Record<string, number> = {}
    for (const d of SEED_DONATIONS) raised[d.campaignId] = (raised[d.campaignId] ?? 0) + d.amount
    expect(searchCampaigns(SEED_CAMPAIGNS as never, { q: 'borehole' }, raised)).toHaveLength(1)
    expect(searchCampaigns(SEED_CAMPAIGNS as never, { category: 'education' }, raised)).toHaveLength(2)
    const funded = searchCampaigns(SEED_CAMPAIGNS as never, { sort: 'funded' }, raised)
    expect(funded[0].id).toBe('lagos-bikes-riders')
  })
})

describe('store', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mem = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    })
  })

  async function fresh() {
    const { useStore } = await import('@/lib/store')
    useStore.getState().resetDemo()
    return useStore
  }

  it('logs in with a demo account and rejects a wrong password', async () => {
    const s = await fresh()
    expect(s.getState().login('amara@demo.fundafrica.app', 'nope').ok).toBe(false)
    expect(s.getState().login('amara@demo.fundafrica.app', 'demo1234').ok).toBe(true)
    expect(s.getState().currentUserId).toBe('u-amara')
  })

  it('records a donation that raises the total and notifies the organiser', async () => {
    const s = await fresh()
    const before = raisedOf('kitui-borehole-repair', s.getState().donations)
    const r = s.getState().donate('kitui-borehole-repair', { amount: 1000, name: 'Test Donor', anonymous: false, message: 'hi', method: 'mobile_money' })
    expect(r.ok).toBe(true)
    expect(raisedOf('kitui-borehole-repair', s.getState().donations)).toBe(before + 1000)
    expect(s.getState().notifications[0].userId).toBe('u-kamau')
  })

  it('refuses an invalid donation without changing totals', async () => {
    const s = await fresh()
    const n = s.getState().donations.length
    const r = s.getState().donate('kitui-borehole-repair', { amount: 1, name: 'X Y', anonymous: false, message: '', method: 'card' })
    expect(r.ok).toBe(false)
    expect(s.getState().donations.length).toBe(n)
  })

  it('needs a signed-in user to create a campaign or comment, then works', async () => {
    const s = await fresh()
    const draft = {
      title: 'New school roof for Mbale', summary: 'Replace the leaking roof of the primary school.', story: 'y'.repeat(100),
      category: 'education' as const, currency: 'UGX', place: 'Mbale', deadline: '2030-06-01',
      budget: [{ label: 'Iron sheets', amount: 4_000_000 }, { label: 'Labour', amount: 1_000_000 }],
    }
    expect(s.getState().createCampaign(draft).ok).toBe(false)
    expect(s.getState().addComment('kitui-borehole-repair', 'Hello there').ok).toBe(false)
    s.getState().login('thandi@demo.fundafrica.app', 'demo1234')
    const r = s.getState().createCampaign(draft)
    expect(r.ok).toBe(true)
    if (r.ok) {
      const c = s.getState().campaigns.find((x) => x.id === r.id)!
      expect(goalOf(c)).toBe(5_000_000)
      expect(c.milestones.map((m) => m.at)).toEqual([4_000_000, 5_000_000])
    }
    expect(s.getState().addComment('kitui-borehole-repair', 'Hello there').ok).toBe(true)
    expect(s.getState().addComment('kitui-borehole-repair', ' ').ok).toBe(false)
  })

  it('signs up a new account and rejects duplicates', async () => {
    const s = await fresh()
    expect(s.getState().signup({ name: 'New Person', email: 'new@x.com', password: 'secret1', country: 'Kenya' }).ok).toBe(true)
    s.getState().logout()
    expect(s.getState().signup({ name: 'New Person', email: 'NEW@x.com', password: 'secret1', country: 'Kenya' }).ok).toBe(false)
  })
})
