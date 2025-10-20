import { ExploreHeader } from "@/components/explore-header"
import { CategoryTabs } from "@/components/category-tabs"
import { FeaturedCampaigns } from "@/components/featured-campaigns"
import { TrendingCampaigns } from "@/components/trending-campaigns"

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-6 space-y-8">
        <CategoryTabs />
        <FeaturedCampaigns />
        <TrendingCampaigns />
      </div>
    </main>
  )
}
