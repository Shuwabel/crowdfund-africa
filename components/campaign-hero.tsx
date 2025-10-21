import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Users } from "lucide-react"

interface CampaignHeroProps {
  campaign: {
    title: string
    creator: {
      name: string
      verified: boolean
      avatar: string
      campaigns: number
      followers: number
    }
    image: string
    category: string
  }
}

export function CampaignHero({ campaign }: CampaignHeroProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-2">
      <div className="relative h-[400px] overflow-hidden bg-muted">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
        )}
        <Badge className="absolute left-4 top-4 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
          {campaign.category}
        </Badge>
      </div>
      <div className="space-y-4 p-6">
        <h1 className="text-balance text-3xl font-bold leading-tight text-foreground">{campaign.title}</h1>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={campaign.creator.avatar || "/placeholder.svg"} alt={campaign.creator.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {campaign.creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{campaign.creator.name}</span>
              {campaign.creator.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{campaign.creator.campaigns} campaigns</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {campaign.creator.followers} followers
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
