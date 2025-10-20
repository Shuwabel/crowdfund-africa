import { NextRequest, NextResponse } from 'next/server'
import { getDonations, createDonation, getUserDonations, getCampaignDonationStats } from '@/lib/donations'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const userId = searchParams.get('userId')
    const stats = searchParams.get('stats')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (stats && campaignId) {
      const donationStats = await getCampaignDonationStats(campaignId)
      return NextResponse.json(donationStats)
    }

    if (userId) {
      const user = await getCurrentUser()
      if (!user || user.id !== userId) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }

      const donations = await getUserDonations(userId, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined
      })

      return NextResponse.json(donations)
    }

    if (!campaignId) {
      return NextResponse.json(
        { message: 'Missing campaign ID' },
        { status: 400 }
      )
    }

    const donations = await getDonations(campaignId, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      includeAnonymous: true
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error('Donations API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const donationData = await request.json()

    const donation = await createDonation({
      ...donationData,
      donor_id: user?.id || null
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Create donation error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create donation' },
      { status: 500 }
    )
  }
}

