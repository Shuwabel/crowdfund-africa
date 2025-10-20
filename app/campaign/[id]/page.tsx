import { CampaignHero } from "@/components/campaign-hero"
import { CampaignStats } from "@/components/campaign-stats"
import { CampaignActions } from "@/components/campaign-actions"
import { CampaignTabs } from "@/components/campaign-tabs"
import { DonorList } from "@/components/donor-list"
import { ExploreHeader } from "@/components/explore-header"

// Mock data - in real app, fetch based on params.id
const campaignData = {
  id: 1,
  title: "Clean Water for Rural Communities",
  creator: {
    name: "Water for Life Foundation",
    verified: true,
    avatar: "/creator-avatar.jpg",
    campaigns: 12,
    followers: 3456,
  },
  image: "/campaign-water-well.jpg",
  video: null,
  raised: 2500000,
  goal: 5000000,
  supporters: 1234,
  daysLeft: 45,
  category: "Community",
  story: `We are working to bring clean, safe drinking water to 15 rural communities in Northern Nigeria. 

Over 5,000 families currently walk 3-5 kilometers daily to access water, and the available sources are often contaminated, leading to waterborne diseases.

Our project will:
• Drill 5 new boreholes in strategic locations
• Install solar-powered pumps for sustainability
• Train local maintenance teams
• Provide water storage solutions for each community

Every donation brings us closer to transforming these communities. With your support, children can spend more time in school instead of fetching water, and families can focus on building better futures.`,
  updates: [
    {
      id: 1,
      date: "2025-01-15",
      title: "First borehole completed!",
      content:
        "We're excited to share that the first borehole has been successfully drilled and is now providing clean water to 350 families.",
    },
  ],
  comments: 89,
}

export default function CampaignPage() {
  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CampaignHero campaign={campaignData} />
            <CampaignTabs campaign={campaignData} />
          </div>
          <div className="space-y-6">
            <CampaignStats campaign={campaignData} />
            <CampaignActions campaignId={campaignData.id} />
            <DonorList campaignId={campaignData.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
