import { NextRequest, NextResponse } from 'next/server'
import { getComments, createComment, updateComment, deleteComment } from '@/lib/comments'
import { getCurrentUser } from '@/lib/auth'

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
    const user = await getCurrentUser()
    
    const commentData = await request.json()
    
    const comment = await createComment({
      ...commentData,
      donor_id: user?.id || null // Allow null for guest comments
    })

    return NextResponse.json(comment, { status: 201 })
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

