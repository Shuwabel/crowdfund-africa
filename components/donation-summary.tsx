import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/currency"
import { Shield, Heart } from "lucide-react"

interface DonationSummaryProps {
  campaign: {
    title: string
    creator: string
    image: string
    raised: number
    goal: number
  }
}

export function DonationSummary({ campaign }: DonationSummaryProps) {
  const progress = (campaign.raised / campaign.goal) * 100

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl">
        <div className="relative h-32 bg-gradient-to-br from-primary/30 to-accent/30" />
        <div className="space-y-3 p-4">
          <h3 className="text-balance text-lg font-semibold leading-tight text-foreground line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {campaign.creator}</p>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold text-foreground">{formatCurrency(campaign.raised)}</span>
              <span className="text-muted-foreground">of {formatCurrency(campaign.goal)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 flex-shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Secure Payment</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 flex-shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Direct Impact</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                100% of your donation goes to the campaign creator
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
