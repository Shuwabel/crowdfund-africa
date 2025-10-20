import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json(
        { message: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const crypto = require('crypto')
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data

      // Update donation status
      const { error } = await supabaseAdmin
        .from('donations')
        .update({
          status: 'completed',
          transaction_id: event.data.id.toString(),
          metadata: {
            ...metadata,
            paystack_data: event.data
          }
        })
        .eq('payment_reference', reference)

      if (error) {
        console.error('Failed to update donation:', error)
        return NextResponse.json(
          { message: 'Failed to update donation' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

