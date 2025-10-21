"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { ExploreHeader } from "@/components/explore-header"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    const status = searchParams.get('status')

    if (status === 'success' && reference) {
      setStatus('success')
      setMessage('Your donation was successful! Thank you for your generosity.')
    } else {
      setStatus('error')
      setMessage('Payment was not successful. Please try again.')
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background">
        <ExploreHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md">
            <Card className="rounded-2xl p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Processing Payment...</h2>
              <p className="text-muted-foreground">Please wait while we verify your donation</p>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <Card className="rounded-2xl p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              {status === 'success' ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-red-500" />
              )}
            </div>
            <h2 className={`mb-2 text-2xl font-bold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {status === 'success' ? 'Donation Successful!' : 'Payment Failed'}
            </h2>
            <p className="mb-6 text-muted-foreground">{message}</p>
            <div className="space-y-3">
              <Link href="/explore">
                <Button size="lg" className="w-full rounded-xl">
                  Explore More Campaigns
                </Button>
              </Link>
              {status === 'success' && (
                <Link href={`/campaign/${searchParams.get('campaign_id')}`}>
                  <Button variant="outline" size="lg" className="w-full rounded-xl bg-transparent">
                    Back to Campaign
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
