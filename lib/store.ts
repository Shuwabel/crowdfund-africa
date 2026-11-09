'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CURRENCIES, makeReference, validateDonation, type CampaignDraft, type DonationInput } from './logic'
import { SEED_CAMPAIGNS, SEED_COMMENTS, SEED_DONATIONS, SEED_NOTIFICATIONS, SEED_USERS } from './seed'
import type { Campaign, Comment, Donation, Notification, User } from './types'

export interface State {
  users: User[]
  campaigns: Campaign[]
  donations: Donation[]
  comments: Comment[]
  notifications: Notification[]
  currentUserId: string | null
  hydrated: boolean

  login: (email: string, password: string) => { ok: true; user: User } | { ok: false; error: string }
  signup: (input: { name: string; email: string; password: string; country: string }) => { ok: true; user: User } | { ok: false; error: string }
  logout: () => void
  createCampaign: (draft: CampaignDraft) => { ok: true; id: string } | { ok: false; error: string }
  donate: (campaignId: string, input: DonationInput) => { ok: true; donation: Donation } | { ok: false; error: string }
  addComment: (campaignId: string, body: string) => { ok: true } | { ok: false; error: string }
  markAllRead: () => void
  resetDemo: () => void
}

function initial() {
  return {
    users: SEED_USERS,
    campaigns: SEED_CAMPAIGNS.map((c) => ({ ...c, seed: true })),
    donations: SEED_DONATIONS,
    comments: SEED_COMMENTS,
    notifications: SEED_NOTIFICATIONS,
    currentUserId: null as string | null,
  }
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      hydrated: false,

      login: (email, password) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
        if (!user || user.password !== password) return { ok: false, error: 'Email or password is not right.' }
        set({ currentUserId: user.id })
        return { ok: true, user }
      },

      signup: ({ name, email, password, country }) => {
        const e = email.trim().toLowerCase()
        if (name.trim().length < 2) return { ok: false, error: 'Add your name.' }
        if (!/^\S+@\S+\.\S+$/.test(e)) return { ok: false, error: 'Enter a valid email address.' }
        if (password.length < 6) return { ok: false, error: 'Use at least 6 characters.' }
        if (get().users.some((u) => u.email.toLowerCase() === e)) return { ok: false, error: 'That email already has a demo account.' }
        const user: User = {
          id: uid('u'),
          name: name.trim(),
          email: e,
          password,
          country,
          bio: '',
          joinedAt: new Date().toISOString(),
        }
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }))
        return { ok: true, user }
      },

      logout: () => set({ currentUserId: null }),

      createCampaign: (draft) => {
        const userId = get().currentUserId
        if (!userId) return { ok: false, error: 'Sign in to start a campaign.' }
        const lines = draft.budget.filter((l) => l.label.trim() && l.amount > 0)
        if (lines.length < 2) return { ok: false, error: 'List at least two budget lines.' }
        const budget = lines.map((l, i) => ({ id: `b${i + 1}`, label: l.label.trim(), amount: Math.round(l.amount) }))
        // one milestone per budget line, unlocked as the running total is covered
        let running = 0
        const milestones = budget.map((l, i) => {
          running += l.amount
          return { id: `m${i + 1}`, title: `${l.label} funded`, at: running, note: 'Unlocked when the budget up to this line is covered.' }
        })
        const taken = new Set(get().campaigns.map((c) => c.id))
        const base = slugify(draft.title) || 'campaign'
        let id = base
        let n = 2
        while (taken.has(id)) id = `${base}-${n++}`
        const country = CURRENCIES.find((c) => c.code === draft.currency)?.country ?? get().users.find((u) => u.id === userId)?.country ?? ''
        const campaign: Campaign = {
          id,
          title: draft.title.trim(),
          summary: draft.summary.trim(),
          story: draft.story.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean),
          category: draft.category,
          country,
          place: draft.place.trim(),
          currency: draft.currency,
          organizerId: userId,
          createdAt: new Date().toISOString(),
          deadline: new Date(draft.deadline).toISOString(),
          budget,
          milestones,
          updates: [],
        }
        set((s) => ({
          campaigns: [campaign, ...s.campaigns],
          notifications: [
            { id: uid('n'), userId, text: `Your campaign "${campaign.title}" is live.`, href: `/campaign/${id}`, createdAt: new Date().toISOString(), read: false },
            ...s.notifications,
          ],
        }))
        return { ok: true, id }
      },

      donate: (campaignId, input) => {
        const campaign = get().campaigns.find((c) => c.id === campaignId)
        if (!campaign) return { ok: false, error: 'Campaign not found.' }
        const errors = validateDonation(input, campaign.currency)
        const first = Object.values(errors)[0]
        if (first) return { ok: false, error: first }
        const userId = get().currentUserId
        const donation: Donation = {
          id: uid('d'),
          campaignId,
          donorId: userId,
          name: input.anonymous ? 'Anonymous' : input.name.trim(),
          anonymous: input.anonymous,
          amount: Math.round(input.amount),
          currency: campaign.currency,
          message: input.message.trim(),
          method: input.method,
          reference: makeReference(Date.now()),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          donations: [donation, ...s.donations],
          notifications: [
            {
              id: uid('n'),
              userId: campaign.organizerId,
              text: `${donation.name} gave to "${campaign.title}".`,
              href: `/campaign/${campaignId}`,
              createdAt: donation.createdAt,
              read: false,
            },
            ...s.notifications,
          ],
        }))
        return { ok: true, donation }
      },

      addComment: (campaignId, body) => {
        const userId = get().currentUserId
        const user = get().users.find((u) => u.id === userId)
        if (!user) return { ok: false, error: 'Sign in to comment.' }
        const text = body.trim()
        if (text.length < 2) return { ok: false, error: 'Write a little more.' }
        if (text.length > 500) return { ok: false, error: 'Keep comments under 500 characters.' }
        const campaign = get().campaigns.find((c) => c.id === campaignId)
        const comment: Comment = { id: uid('c'), campaignId, userId: user.id, name: user.name, body: text, createdAt: new Date().toISOString() }
        set((s) => ({
          comments: [...s.comments, comment],
          notifications:
            campaign && campaign.organizerId !== user.id
              ? [
                  { id: uid('n'), userId: campaign.organizerId, text: `${user.name} commented on "${campaign.title}".`, href: `/campaign/${campaignId}`, createdAt: comment.createdAt, read: false },
                  ...s.notifications,
                ]
              : s.notifications,
        }))
        return { ok: true }
      },

      markAllRead: () => {
        const userId = get().currentUserId
        set((s) => ({ notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)) }))
      },

      resetDemo: () => set({ ...initial() }),
    }),
    {
      name: 'fundafrica-demo-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        users: s.users,
        campaigns: s.campaigns,
        donations: s.donations,
        comments: s.comments,
        notifications: s.notifications,
        currentUserId: s.currentUserId,
      }),
      onRehydrateStorage: () => () => {
        useStore.setState({ hydrated: true })
      },
    }
  )
)
