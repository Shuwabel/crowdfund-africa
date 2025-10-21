import { NextRequest, NextResponse } from 'next/server'
import { getComments, createComment, updateComment, deleteComment } from '@/lib/comments'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!campaignId) {
      return NextResponse.json(
        { message: 'Missing campaign ID' },
        { status: 400 }
      )
    }

    const comments = await getComments(campaignId, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comments API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to get current user, but don't require authentication
    let user = null
    try {
      user = await getCurrentUser()
    } catch (error) {
      // User is not authenticated, which is fine for guest comments
      console.log('Guest comment - no authenticated user')
    }
    
    const commentData = await request.json()
    
    // Use admin client to bypass RLS for guest comments
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        ...commentData,
        user_id: user?.id || '0723b49e-70b3-4b79-84fc-9276995387a0' // Use real guest user ID
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, ...updateData } = await request.json()
    
    const comment = await updateComment(id, updateData)

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Update comment error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update comment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'Missing comment ID' },
        { status: 400 }
      )
    }

    await deleteComment(id)

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

