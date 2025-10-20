import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface StepPreviewProps {
  formData: {
    title: string
    category: string
    story: string
    images: string[]
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
        {/* Campaign Image/Header */}
        <div className="relative h-48 overflow-hidden">
          {formData.images && formData.images.length > 0 ? (
            <img
              src={formData.images[0]}
              alt={formData.title || "Campaign image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 to-accent/30" />
          )}
          <Badge className="absolute left-4 top-4 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
            {formData.category || "Category"}
          </Badge>
        </div>
        
        <div className="space-y-4 p-6">
          <h3 className="text-balance text-2xl font-bold leading-tight text-foreground">
            {formData.title || "Campaign Title"}
          </h3>
          
          {/* Campaign Story */}
          {formData.story && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Story</h4>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {formData.story}
              </p>
            </div>
          )}

          {/* Additional Images */}
          {formData.images && formData.images.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Additional Images</h4>
              <div className="grid grid-cols-2 gap-2">
                {formData.images.slice(1).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Campaign image ${index + 2}`}
                    className="h-20 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          
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
