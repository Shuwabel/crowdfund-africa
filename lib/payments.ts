import { DonationInsert } from './types'
import { generatePaymentReference } from './donations'

export interface PaymentData {
  amount: number
  email: string
  reference: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  reference: string
  authorization_url?: string
  access_code?: string
  message?: string
}

// Paystack integration
export async function initializePaystackPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    const response = await fetch('/api/payments/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment initialization failed')
    }

    return data
  } catch (error) {
    throw new Error(`Paystack payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function verifyPaystackPayment(reference: string): Promise<{
  success: boolean
  amount: number
  status: string
  metadata?: any
}> {
  try {
    const response = await fetch(`/api/payments/paystack/verify?reference=${reference}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment verification failed')
    }

    return data
  } catch (error) {
    throw new Error(`Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// USSD payment simulation
export async function generateUSSDPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    const response = await fetch('/api/payments/ussd/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'USSD payment generation failed')
    }

    return data
  } catch (error) {
    throw new Error(`USSD payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Mobile wallet payment
export async function initializeWalletPayment(paymentData: PaymentData): Promise<PaymentResponse> {
  try {
    const response = await fetch('/api/payments/wallet/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Wallet payment initialization failed')
    }

    return data
  } catch (error) {
    throw new Error(`Wallet payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function processDonationPayment(
  donationData: Omit<DonationInsert, 'payment_reference' | 'status'>,
  paymentMethod: 'card' | 'ussd' | 'wallet',
  userEmail: string
): Promise<{ donation: DonationInsert; paymentResponse: PaymentResponse }> {
  const paymentReference = await generatePaymentReference()
  
  const donation: DonationInsert = {
    ...donationData,
    payment_reference: paymentReference,
    status: 'pending'
  }

  const paymentData: PaymentData = {
    amount: donationData.amount,
    email: userEmail,
    reference: paymentReference,
    metadata: {
      campaign_id: donationData.campaign_id,
      donor_id: donationData.donor_id,
      is_anonymous: donationData.is_anonymous
    }
  }

  let paymentResponse: PaymentResponse

  switch (paymentMethod) {
    case 'card':
      paymentResponse = await initializePaystackPayment(paymentData)
      break
    case 'ussd':
      paymentResponse = await generateUSSDPayment(paymentData)
      break
    case 'wallet':
      paymentResponse = await initializeWalletPayment(paymentData)
      break
    default:
      throw new Error('Invalid payment method')
  }

  return { donation, paymentResponse }
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatAmountWithDecimals(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

