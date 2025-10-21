"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Campaign } from "@/lib/types"
import { formatCurrencyWithGoal } from "@/lib/currency"

interface TrendingCampaignsProps {
  category?: string
  search?: string
}

export function TrendingCampaigns({ category, search }: TrendingCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        if (category && category !== 'all') {
          params.set('category', category)
        }
        
        if (search) {
          params.set('search', search)
        }
        
        params.set('status', 'active')
        params.set('limit', '8')

        const response = await fetch(`/api/campaigns?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns')
        }
        
        const data = await response.json()
        // Sort by supporters count to show trending campaigns
        const sortedData = data.sort((a: Campaign, b: Campaign) => ((b as any).supporters_count || 0) - ((a as any).supporters_count || 0))
        setCampaigns(sortedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns')
        console.error('Error fetching campaigns:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [category, search])

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trending Campaigns</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading campaigns...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trending Campaigns</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </section>
    )
  }

  if (campaigns.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trending Campaigns</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Trending Campaigns</h2>
        <Link href="/explore" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const progress = campaign.goal_amount > 0 ? (campaign.current_amount / campaign.goal_amount) * 100 : 0
          const imageUrl = campaign.featured_image_url || (campaign.images && campaign.images.length > 0 ? campaign.images[0] : null)
          
          return (
            <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
              <Card className="group overflow-hidden rounded-2xl border-2 transition-all hover:border-primary hover:shadow-lg">
                <div className="relative h-40 overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={campaign.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <Badge className="absolute right-3 top-3 rounded-lg bg-card/90 text-card-foreground backdrop-blur">
                    {campaign.category}
                  </Badge>
                  {((campaign as any).supporters_count || 0) > 50 && (
                    <Badge className="absolute left-3 top-3 rounded-lg bg-orange-500/90 text-white backdrop-blur">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-balance text-base font-semibold leading-tight text-foreground group-hover:text-primary">
                      {campaign.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {(campaign as any).creator?.full_name || 'Anonymous'}</span>
                    {campaign.is_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-baseline justify-between text-sm">
                      <div>
                        <span className="text-base font-bold text-foreground">
                          {formatCurrencyWithGoal(campaign.current_amount, campaign.goal_amount)}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{(campaign as any).supporters_count || 0} supporters</span>
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