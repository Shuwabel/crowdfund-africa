import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface StepPreviewProps {
  formData: {
    title: string
    category: string
    story: string
    goal: string
    duration: string
    accountName: string
    accountNumber: string
    bankName: string
  }
  updateFormData: (data: any) => void
}

export function StepPreview({ formData }: StepPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review your campaign</h2>
        <p className="mt-2 text-muted-foreground">Make sure everything looks good before publishing</p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-2">
        <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/30">
          <Badge className="absolute left-4 top-4 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
            {formData.category || "Category"}
          </Badge>
        </div>
        <div className="space-y-4 p-6">
          <h3 className="text-balance text-2xl font-bold leading-tight text-foreground">
            {formData.title || "Campaign Title"}
          </h3>
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Goal</span>
              <span className="font-semibold text-foreground">₦{formData.goal || "0"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="font-semibold text-foreground">{formData.duration || "0"} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bank Account</span>
              <span className="font-semibold text-foreground">{formData.bankName || "Not set"}</span>
            </div>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Ready to publish</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your campaign will be reviewed within 24 hours. You'll receive an email once it's live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
