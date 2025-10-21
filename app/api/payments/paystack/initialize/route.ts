import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { campaignId, amount, paystackAmount, message, isAnonymous, paymentMethod } = await request.json()

    if (!campaignId || !amount) {
      return NextResponse.json(
        { message: 'Missing required fields: campaignId and amount' },
        { status: 400 }
      )
    }

    // Generate a unique reference for this donation
    const reference = `donation_${campaignId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .select('title, creator_id')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Create donation record in database with original amount (in naira)
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        campaign_id: campaignId,
        amount: amount, // Store original amount in naira
        message: message || null,
        is_anonymous: isAnonymous || false,
        payment_method: paymentMethod || 'card',
        payment_reference: reference,
        status: 'pending'
      })
      .select()
      .single()

    if (donationError) {
      console.error('Error creating donation:', donationError)
      return NextResponse.json(
        { message: 'Failed to create donation record' },
        { status: 500 }
      )
    }

    // Initialize Paystack payment with kobo amount
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paystackAmount || amount * 100, // Use kobo amount for Paystack
        email: 'donor@fundafrica.com', // We'll use a generic email for now
        reference,
        metadata: {
          campaign_id: campaignId,
          donation_id: donation.id,
          campaign_title: campaign.title
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paystack/callback`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      throw new Error(paystackData.message || 'Paystack initialization failed')
    }

    return NextResponse.json({
      success: true,
      reference: paystackData.data.reference,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      message: 'Payment initialized successfully'
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Payment initialization failed' 
      },
      { status: 500 }
    )
  }
}

