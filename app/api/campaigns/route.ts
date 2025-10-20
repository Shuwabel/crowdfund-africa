import { NextRequest, NextResponse } from 'next/server'
import { getCampaigns, getCampaignById } from '@/lib/campaigns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (id) {
      const campaign = await getCampaignById(id)
      if (!campaign) {
        return NextResponse.json(
          { message: 'Campaign not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(campaign)
    }

    const campaigns = await getCampaigns({
      status: status || undefined,
      category: category || undefined,
      featured: featured ? featured === 'true' : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Campaigns API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

