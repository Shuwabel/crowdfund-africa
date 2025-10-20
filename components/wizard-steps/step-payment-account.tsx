"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"

interface StepPaymentAccountProps {
  formData: { accountName: string; accountNumber: string; bankName: string }
  updateFormData: (data: Partial<{ accountName: string; accountNumber: string; bankName: string }>) => void
}

export function StepPaymentAccount({ formData, updateFormData }: StepPaymentAccountProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Payment account details</h2>
        <p className="mt-2 text-muted-foreground">Where should we send the funds you raise?</p>
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Your information is secure</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We use bank-level encryption to protect your account details. Funds are transferred directly to your
              account.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            placeholder="Full name as it appears on your account"
            value={formData.accountName}
            onChange={(e) => updateFormData({ accountName: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            placeholder="10-digit account number"
            value={formData.accountNumber}
            onChange={(e) => updateFormData({ accountNumber: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Select value={formData.bankName} onValueChange={(value) => updateFormData({ bankName: value })}>
            <SelectTrigger id="bankName" className="rounded-xl">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="access">Access Bank</SelectItem>
              <SelectItem value="gtb">GTBank</SelectItem>
              <SelectItem value="firstbank">First Bank</SelectItem>
              <SelectItem value="zenith">Zenith Bank</SelectItem>
              <SelectItem value="uba">UBA</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
