export type Category = 'health' | 'education' | 'water' | 'farming' | 'business' | 'community'

export interface User {
  id: string
  name: string
  email: string
  /** Demo only: kept in this browser's localStorage, never sent anywhere. */
  password: string
  country: string
  bio: string
  joinedAt: string
  demo?: boolean
}

export interface BudgetLine {
  id: string
  label: string
  amount: number
}

export interface Milestone {
  id: string
  title: string
  /** Funds that must be raised to unlock this step. */
  at: number
  note: string
}

export interface CampaignUpdate {
  id: string
  date: string
  title: string
  body: string
}

export interface Campaign {
  id: string
  title: string
  summary: string
  story: string[]
  category: Category
  country: string
  place: string
  currency: string
  organizerId: string
  createdAt: string
  deadline: string
  budget: BudgetLine[]
  milestones: Milestone[]
  updates: CampaignUpdate[]
  seed?: boolean
}

export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer'

export interface Donation {
  id: string
  campaignId: string
  donorId: string | null
  name: string
  anonymous: boolean
  amount: number
  currency: string
  message: string
  method: PaymentMethod
  reference: string
  createdAt: string
}

export interface Comment {
  id: string
  campaignId: string
  userId: string
  name: string
  body: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  text: string
  href: string
  createdAt: string
  read: boolean
}
