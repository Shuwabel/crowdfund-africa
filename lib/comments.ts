import { supabase } from './supabase'
import { 
  Comment, 
  CommentInsert, 
  CommentUpdate, 
  CommentWithUser 
} from './types'

export async function getComments(campaignId: string, filters?: {
  limit?: number
  offset?: number
}): Promise<CommentWithUser[]> {
  let query = supabase
    .from('comments')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('campaign_id', campaignId)
    .eq('is_deleted', false)
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }

  if (!data) return []

  // Fetch replies for each comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const { data: replies } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('parent_id', comment.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      return {
        ...comment,
        replies: replies || []
      }
    })
  )

  return commentsWithReplies
}

export async function createComment(comment: CommentInsert): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`)
  }

  return data
}

export async function updateComment(id: string, updates: CommentUpdate): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update comment: ${error.message}`)
  }

  return data
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`)
  }
}

export async function getCommentById(id: string): Promise<CommentWithUser | null> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch comment: ${error.message}`)
  }

  return data
}

