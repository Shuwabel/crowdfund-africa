import { supabase } from './supabase'
import { 
  Donation, 
  DonationInsert, 
  DonationUpdate, 
  DonationWithDonor 
} from './types'

export async function getDonations(campaignId: string, filters?: {
  limit?: number
  offset?: number
  includeAnonymous?: boolean
}): Promise<DonationWithDonor[]> {
  let query = supabase
    .from('donations')
    .select(`
      *,
      donor:profiles(*),
      campaign:campaigns(*)
    `)
    .eq('campaign_id', campaignId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  if (!filters?.includeAnonymous) {
    query = query.eq('is_anonymous', false)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch donations: ${error.message}`)
  }

  return data || []
}

export async function createDonation(donation: DonationInsert): Promise<Donation> {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create donation: ${error.message}`)
  }

  return data
}

export async function updateDonation(id: string, updates: DonationUpdate): Promise<Donation> {
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update donation: ${error.message}`)
  }

  return data
}

export async function getDonationByReference(paymentReference: string): Promise<Donation | null> {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('payment_reference', paymentReference)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch donation: ${error.message}`)
  }

  return data
}

export async function getUserDonations(userId: string, filters?: {
  limit?: number
  offset?: number
}): Promise<DonationWithDonor[]> {
  let query = supabase
    .from('donations')
    .select(`
      *,
      donor:profiles(*),
      campaign:campaigns(*)
    `)
    .eq('donor_id', userId)
    .order('created_at', { ascending: false })

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch user donations: ${error.message}`)
  }

  return data || []
}

export async function getCampaignDonationStats(campaignId: string): Promise<{
  totalAmount: number
  totalDonations: number
  averageDonation: number
  topDonation: number
}> {
  const { data, error } = await supabase
    .from('donations')
    .select('amount')
    .eq('campaign_id', campaignId)
    .eq('status', 'completed')

  if (error) {
    throw new Error(`Failed to fetch donation stats: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return {
      totalAmount: 0,
      totalDonations: 0,
      averageDonation: 0,
      topDonation: 0
    }
  }

  const amounts = data.map(d => d.amount)
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0)
  const totalDonations = amounts.length
  const averageDonation = totalAmount / totalDonations
  const topDonation = Math.max(...amounts)

  return {
    totalAmount,
    totalDonations,
    averageDonation,
    topDonation
  }
}

export async function generatePaymentReference(): Promise<string> {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `DON_${timestamp}_${random}`.toUpperCase()
}

