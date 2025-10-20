import { NextRequest, NextResponse } from 'next/server'
import { createCampaign, updateCampaign, deleteCampaign } from '@/lib/campaigns'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const campaignData = await request.json()
    
    const campaign = await createCampaign({
      ...campaignData,
      creator_id: user.id
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Create campaign error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create campaign' },
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
    
    const campaign = await updateCampaign(id, updateData)

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Update campaign error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update campaign' },
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
        { message: 'Missing campaign ID' },
        { status: 400 }
      )
    }

    await deleteCampaign(id)

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Delete campaign error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}

