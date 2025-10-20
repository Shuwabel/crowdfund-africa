import { ExploreHeader } from "@/components/explore-header"
import { CategoryTabs } from "@/components/category-tabs"
import { FeaturedCampaigns } from "@/components/featured-campaigns"
import { TrendingCampaigns } from "@/components/trending-campaigns"

interface ExplorePageProps {
  searchParams: Promise<{
    category?: string
    search?: string
  }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  
  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-6 space-y-8">
        <CategoryTabs />
        <FeaturedCampaigns category={params.category} search={params.search} />
        <TrendingCampaigns category={params.category} search={params.search} />
      </div>
    </main>
  )
}
