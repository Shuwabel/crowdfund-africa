import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Target } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

interface CampaignStatsProps {
  campaign: {
    raised: number
    goal: number
    supporters: number
    daysLeft: number
  }
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const progress = (campaign.raised / campaign.goal) * 100

  return (
    <Card className="sticky top-20 space-y-6 rounded-2xl border-2 p-6">
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground">{formatCurrency(campaign.raised)}</span>
        </div>
        <p className="text-sm text-muted-foreground">raised of {formatCurrency(campaign.goal)} goal</p>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Supporters</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.supporters.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Days Left</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{campaign.daysLeft}</p>
        </div>
      </div>

      <div className="rounded-xl bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 flex-shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Transparency Guarantee</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All funds are tracked and verified. Campaign updates include GPS coordinates and photos of completed work.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
