import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Handle GET requests (redirect from Paystack)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')

    if (!reference) {
      return NextResponse.redirect(new URL('/payment/success?status=error', request.url))
    }

    // Verify the payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      }
    })

    const verifyData = await verifyResponse.json()

    if (!verifyResponse.ok || !verifyData.status) {
      return NextResponse.redirect(new URL('/payment/success?status=error', request.url))
    }

    // Update donation status in database
    const { error: updateError } = await supabaseAdmin
      .from('donations')
      .update({ 
        status: 'completed',
        transaction_id: verifyData.data.transaction_id
      })
      .eq('payment_reference', reference)

    if (updateError) {
      console.error('Error updating donation:', updateError)
    }

    // Update campaign current_amount
    const { data: donation } = await supabaseAdmin
      .from('donations')
      .select('campaign_id, amount')
      .eq('payment_reference', reference)
      .single()

    if (donation) {
      // Get current campaign amount and add donation amount
      const { data: campaign } = await supabaseAdmin
        .from('campaigns')
        .select('current_amount')
        .eq('id', donation.campaign_id)
        .single()

      if (campaign) {
        await supabaseAdmin
          .from('campaigns')
          .update({ 
            current_amount: campaign.current_amount + donation.amount
          })
          .eq('id', donation.campaign_id)
      }
    }

    // Redirect to success page
    return NextResponse.redirect(new URL(`/payment/success?status=success&reference=${reference}&campaign_id=${donation?.campaign_id}`, request.url))

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/payment/success?status=error', request.url))
  }
}

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

