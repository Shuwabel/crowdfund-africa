import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { updateDonation } from '@/lib/donations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { message: 'Missing reference parameter' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      }
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      throw new Error(paystackData.message || 'Payment verification failed')
    }

    const { status, amount, metadata } = paystackData.data

    if (status === 'success') {
      // Update donation status
      const { error } = await supabaseAdmin
        .from('donations')
        .update({
          status: 'completed',
          transaction_id: paystackData.data.id.toString(),
          metadata: {
            ...metadata,
            paystack_data: paystackData.data
          }
        })
        .eq('payment_reference', reference)

      if (error) {
        throw new Error(`Failed to update donation: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: status === 'success',
      amount: amount / 100, // Convert from kobo
      status,
      metadata
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Payment verification failed' 
      },
      { status: 500 }
    )
  }
}

