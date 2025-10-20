"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const trendingCampaigns = [
  {
    id: 3,
    title: "Medical Treatment for Baby Amara",
    creator: "Amara's Family",
    verified: false,
    image: "/campaign-medical.jpg",
    raised: 1800000,
    goal: 3000000,
    category: "health",
    supporters: 892,
    trending: true,
  },
  {
    id: 4,
    title: "Start-up Capital for Women Farmers",
    creator: "AgriWomen Collective",
    verified: true,
    image: "/campaign-farming.jpg",
    raised: 450000,
    goal: 800000,
    category: "business",
    supporters: 234,
    trending: true,
  },
  {
    id: 5,
    title: "Rebuild Community Center After Flood",
    creator: "Riverside Community",
    verified: true,
    image: "/campaign-community.jpg",
    raised: 3200000,
    goal: 5000000,
    category: "emergency",
    supporters: 1567,
    trending: true,
  },
  {
    id: 6,
    title: "University Scholarship Fund",
    creator: "Future Leaders Foundation",
    verified: true,
    image: "/campaign-scholarship.jpg",
    raised: 2100000,
    goal: 4000000,
    category: "education",
    supporters: 678,
    trending: true,
  },
]

interface TrendingCampaignsProps {
  category?: string
  search?: string
}

export function TrendingCampaigns({ category, search }: TrendingCampaignsProps) {
  const [filteredCampaigns, setFilteredCampaigns] = useState(trendingCampaigns)

  useEffect(() => {
    let filtered = trendingCampaigns

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(campaign => 
        campaign.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by search query
    if (search && search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.creator.toLowerCase().includes(searchLower) ||
        campaign.category.toLowerCase().includes(searchLower)
      )
    }

    setFilteredCampaigns(filtered)
  }, [category, search])

  if (filteredCampaigns.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No trending campaigns found matching your criteria.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredCampaigns.map((campaign) => {
          const progress = (campaign.raised / campaign.goal) * 100
          return (
            <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
              <Card className="group overflow-hidden rounded-2xl transition-all hover:border-primary hover:shadow-lg">
                <div className="relative h-40 overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <Badge className="absolute right-3 top-3 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
                    {campaign.category}
                  </Badge>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="text-balance text-base font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="truncate">by {campaign.creator}</span>
                    {campaign.verified && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground">₦{(campaign.raised / 1000).toFixed(0)}k</span>
                        <span className="text-muted-foreground"> of ₦{(campaign.goal / 1000).toFixed(0)}k</span>
                      </div>
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
