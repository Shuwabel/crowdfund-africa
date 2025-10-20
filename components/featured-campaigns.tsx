import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

const featuredCampaigns = [
  {
    id: 1,
    title: "Clean Water for Rural Communities",
    creator: "Water for Life Foundation",
    verified: true,
    image: "/campaign-water-well.jpg",
    raised: 2500000,
    goal: 5000000,
    category: "Community",
    supporters: 1234,
  },
  {
    id: 2,
    title: "School Supplies for 500 Children",
    creator: "Education First Initiative",
    verified: true,
    image: "/campaign-school-supplies.jpg",
    raised: 850000,
    goal: 1200000,
    category: "Education",
    supporters: 456,
  },
]

export function FeaturedCampaigns() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Featured Campaigns</h2>
        <Link href="/campaigns/featured" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {featuredCampaigns.map((campaign) => {
          const progress = (campaign.raised / campaign.goal) * 100
          return (
            <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
              <Card className="group overflow-hidden rounded-2xl border-2 transition-all hover:border-primary hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <Badge className="absolute right-3 top-3 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
                    {campaign.category}
                  </Badge>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-balance text-lg font-semibold leading-tight text-foreground group-hover:text-primary">
                      {campaign.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {campaign.creator}</span>
                    {campaign.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-baseline justify-between text-sm">
                      <div>
                        <span className="text-lg font-bold text-foreground">
                          ₦{(campaign.raised / 1000).toFixed(0)}k
                        </span>
                        <span className="text-muted-foreground"> raised of ₦{(campaign.goal / 1000).toFixed(0)}k</span>
                      </div>
                      <span className="text-muted-foreground">{campaign.supporters} supporters</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
