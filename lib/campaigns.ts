import { supabase } from './supabase'
import { 
  Campaign, 
  CampaignInsert, 
  CampaignUpdateType, 
  CampaignWithCreator, 
  CampaignWithStats,
  CampaignUpdate,
  CampaignUpdateInsert
} from './types'

export async function getCampaigns(filters?: {
  status?: string
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}): Promise<CampaignWithCreator[]> {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      creator:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.featured !== undefined) {
    query = query.eq('is_featured', filters.featured)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,story.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch campaigns: ${error.message}`)
  }

  return data || []
}

export async function getCampaignById(id: string): Promise<CampaignWithStats | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      creator:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch campaign: ${error.message}`)
  }

  // Get additional stats
  const [
    { data: supportersData },
    { count: donationsResult },
    { count: updatesResult },
    { count: commentsResult }
  ] = await Promise.all([
    supabase
      .from('donations')
      .select('donor_id')
      .eq('campaign_id', id)
      .eq('status', 'completed')
      .neq('is_anonymous', true),
    supabase
      .from('donations')
      .select('id', { count: 'exact' })
      .eq('campaign_id', id)
      .eq('status', 'completed'),
    supabase
      .from('campaign_updates')
      .select('id', { count: 'exact' })
      .eq('campaign_id', id),
    supabase
      .from('comments')
      .select('id', { count: 'exact' })
      .eq('campaign_id', id)
      .eq('is_deleted', false)
  ])

  // Count unique supporters
  const uniqueSupporters = new Set(supportersData?.map(d => d.donor_id).filter(Boolean)).size

  return {
    ...data,
    supporters_count: uniqueSupporters,
    donations_count: donationsResult || 0,
    updates_count: updatesResult || 0,
    comments_count: commentsResult || 0
  }
}

export async function createCampaign(campaign: CampaignInsert, client?: any): Promise<Campaign> {
  const supabaseClient = client || supabase
  const { data, error } = await supabaseClient
    .from('campaigns')
    .insert(campaign)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create campaign: ${error.message}`)
  }

  return data
}

export async function updateCampaign(id: string, updates: CampaignUpdateType): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update campaign: ${error.message}`)
  }

  return data
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete campaign: ${error.message}`)
  }
}

export async function getCampaignUpdates(campaignId: string): Promise<CampaignUpdate[]> {
  const { data, error } = await supabase
    .from('campaign_updates')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch campaign updates: ${error.message}`)
  }

  return data || []
}

export async function createCampaignUpdate(update: CampaignUpdateInsert): Promise<CampaignUpdate> {
  const { data, error } = await supabase
    .from('campaign_updates')
    .insert(update)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create campaign update: ${error.message}`)
  }

  return data
}

export async function followCampaign(campaignId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('campaign_follows')
    .insert({
      campaign_id: campaignId,
      user_id: userId
    })

  if (error) {
    throw new Error(`Failed to follow campaign: ${error.message}`)
  }
}

export async function unfollowCampaign(campaignId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('campaign_follows')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to unfollow campaign: ${error.message}`)
  }
}

export async function isFollowingCampaign(campaignId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('campaign_follows')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check follow status: ${error.message}`)
  }

  return !!data
}

export async function searchCampaigns(query: string, filters?: {
  category?: string
  status?: string
  limit?: number
}): Promise<CampaignWithCreator[]> {
  let supabaseQuery = supabase
    .from('campaigns')
    .select(`
      *,
      creator:profiles(*)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,story.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (filters?.category) {
    supabaseQuery = supabaseQuery.eq('category', filters.category)
  }

  if (filters?.status) {
    supabaseQuery = supabaseQuery.eq('status', filters.status)
  }

  if (filters?.limit) {
    supabaseQuery = supabaseQuery.limit(filters.limit)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    throw new Error(`Failed to search campaigns: ${error.message}`)
  }

  return data || []
}

