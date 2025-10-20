"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"

interface StepGoalDurationProps {
  formData: { goal: string; duration: string }
  updateFormData: (data: Partial<{ goal: string; duration: string }>) => void
}

export function StepGoalDuration({ formData, updateFormData }: StepGoalDurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Set your fundraising goal</h2>
        <p className="mt-2 text-muted-foreground">Choose a realistic target and timeline for your campaign</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal">Fundraising Goal (₦)</Label>
          <Input
            id="goal"
            type="number"
            placeholder="e.g., 5000000"
            value={formData.goal}
            onChange={(e) => updateFormData({ goal: e.target.value })}
            className="rounded-xl"
          />
          <div className="flex items-start gap-2 rounded-lg bg-primary/10 p-3">
            <Info className="h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-foreground">
              Set a goal that covers your needs plus platform fees. Be transparent about how funds will be used.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Campaign Duration</Label>
          <Select value={formData.duration} onValueChange={(value) => updateFormData({ duration: value })}>
            <SelectTrigger id="duration" className="rounded-xl">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="custom">Custom duration</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Most successful campaigns run for 30-60 days</p>
        </div>
      </div>
    </div>
  )
}
