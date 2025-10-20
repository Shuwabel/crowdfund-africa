"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepBasicInfoProps {
  formData: { title: string; category: string }
  updateFormData: (data: Partial<{ title: string; category: string }>) => void
}

export function StepBasicInfo({ formData, updateFormData }: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Let's start with the basics</h2>
        <p className="mt-2 text-muted-foreground">Give your campaign a clear, compelling title and choose a category</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            placeholder="e.g., Clean Water for Rural Communities"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Make it clear and specific to attract supporters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
            <SelectTrigger id="category" className="rounded-xl">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
