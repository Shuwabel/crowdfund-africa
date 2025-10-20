"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

interface StepStoryMediaProps {
  formData: { story: string; images: string[] }
  updateFormData: (data: Partial<{ story: string; images: string[] }>) => void
}

export function StepStoryMedia({ formData, updateFormData }: StepStoryMediaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tell your story</h2>
        <p className="mt-2 text-muted-foreground">Share why this campaign matters and how funds will be used</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="story">Campaign Story</Label>
          <Textarea
            id="story"
            placeholder="Share your story... Why is this important? Who will benefit? How will the funds be used?"
            value={formData.story}
            onChange={(e) => updateFormData({ story: e.target.value })}
            className="min-h-[200px] rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Be honest and specific. Include details about your plan.</p>
        </div>

        <div className="space-y-2">
          <Label>Campaign Images</Label>
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Upload campaign images</p>
                <p className="text-xs text-muted-foreground">Add photos that show your cause and build trust</p>
              </div>
              <Button variant="outline" className="rounded-xl bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
