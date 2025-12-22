import { NextRequest, NextResponse } from 'next/server'
import { getCampaigns, getCampaignById, createCampaign } from '@/lib/campaigns'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const creator_id = searchParams.get('creator_id')
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
          search: search || undefined,
          creator_id: creator_id || undefined,
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

export async function POST(request: NextRequest) {
  try {
    // Create server client to get user session
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://REDACTED.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'REDACTED',
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      category,
      story,
      images,
      goal,
      duration,
      account_name,
      account_number,
      bank_name
    } = body

    // Validate required fields
    if (!title || !category || !story || !goal) {
      return NextResponse.json(
        { message: 'Missing required fields: title, category, story, goal' },
        { status: 400 }
      )
    }

    // Calculate end_date from duration
    const durationDays = Number(duration) || 30
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + durationDays)

    // Create campaign
    const campaign = await createCampaign({
      title,
      description: story.substring(0, 200) + (story.length > 200 ? '...' : ''), // Use first 200 chars as description
      category,
      story,
      images: images || [],
      goal_amount: Number(goal),
      end_date: endDate.toISOString(),
      account_name: account_name || '',
      account_number: account_number || '',
      bank_name: bank_name || '',
      creator_id: user.id
    }, supabase)

    return NextResponse.json({
      message: 'Campaign created successfully',
      campaign
    })

  } catch (error) {
    console.error('Create campaign API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

