"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Smartphone, Wallet } from "lucide-react"

const suggestedAmounts = [5000, 10000, 25000, 50000, 100000]

interface DonationFormProps {
  campaignId: string
}

export function DonationForm({ campaignId }: DonationFormProps) {
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDonate = async () => {
    if (!amount && !customAmount) {
      alert('Please enter a donation amount')
      return
    }

    const donationAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount)
    
    if (donationAmount <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    try {
      // Initialize Paystack payment
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          amount: donationAmount, // Store original amount in naira
          paystackAmount: donationAmount * 100, // Convert to kobo for Paystack
          message: message || '',
          isAnonymous: isAnonymous,
          paymentMethod: paymentMethod
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment')
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url
    } catch (error) {
      console.error('Payment initialization error:', error)
      alert(error instanceof Error ? error.message : 'Failed to process donation')
    }
  }

  if (showSuccess) {
    return (
      <Card className="rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <div className="animate-pulse text-4xl">❤️</div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Thank you for your generosity!</h2>
        <p className="mb-6 text-muted-foreground">Your donation is making a real difference</p>
        <div className="space-y-3">
          <Button size="lg" className="w-full rounded-xl" onClick={() => (window.location.href = "/explore")}>
            Explore More Campaigns
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-xl bg-transparent"
            onClick={() => (window.location.href = `/campaign/${campaignId}`)}
          >
            Back to Campaign
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl p-6">
      <div className="space-y-6">
        {/* Amount Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Amount</Label>
          <div className="grid grid-cols-3 gap-3">
            {suggestedAmounts.map((suggestedAmount) => (
              <Button
                key={suggestedAmount}
                variant={amount === suggestedAmount.toString() ? "default" : "outline"}
                className="rounded-xl bg-transparent"
                onClick={() => {
                  setAmount(suggestedAmount.toString())
                  setCustomAmount("")
                }}
              >
                ₦{(suggestedAmount / 1000).toFixed(0)}k
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customAmount">Or enter custom amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setAmount("")
                }}
                className="rounded-xl pl-8"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Leave a message (optional)</Label>
          <Textarea
            id="message"
            placeholder="Share words of encouragement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-xl"
            rows={3}
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center space-x-2">
          <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(!!checked)} />
          <Label htmlFor="anonymous" className="cursor-pointer text-sm font-normal">
            Make this donation anonymous
          </Label>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-2">
              <label
                htmlFor="card"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Card Payment</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Verve</p>
                </div>
              </label>

              <label
                htmlFor="ussd"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  paymentMethod === "ussd" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="ussd" id="ussd" />
                <Smartphone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">USSD</p>
                  <p className="text-xs text-muted-foreground">Dial code from your phone</p>
                </div>
              </label>

              <label
                htmlFor="wallet"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="wallet" id="wallet" />
                <Wallet className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Mobile Wallet</p>
                  <p className="text-xs text-muted-foreground">Pay with your mobile money</p>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Donate Button */}
        <Button
          size="lg"
          className="w-full rounded-xl text-base font-semibold shadow-lg"
          onClick={handleDonate}
          disabled={!amount && !customAmount}
        >
          Donate ₦{amount || customAmount || "0"}
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By donating, you agree to our terms. Your payment is secure and encrypted.
        </p>
      </div>
    </Card>
  )
}
