import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { amount, email, reference, metadata } = await request.json()

    if (!amount || !email || !reference) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        reference,
        metadata,
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

