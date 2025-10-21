import { CampaignHero } from "@/components/campaign-hero"
import { CampaignStats } from "@/components/campaign-stats"
import { CampaignActions } from "@/components/campaign-actions"
import { CampaignTabs } from "@/components/campaign-tabs"
import { DonorList } from "@/components/donor-list"
import { ExploreHeader } from "@/components/explore-header"
import { getCampaignById } from "@/lib/campaigns"
import { notFound } from "next/navigation"

interface CampaignPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params
  
  try {
    const campaign = await getCampaignById(id)
    
    if (!campaign) {
      notFound()
    }

    // Calculate days left
    const endDate = new Date(campaign.end_date || '')
    const now = new Date()
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    // Transform campaign data to match component expectations
    const campaignData = {
      id: campaign.id,
      title: campaign.title,
      creator: {
        name: campaign.creator?.full_name || 'Anonymous',
        verified: campaign.creator?.is_verified || false,
        avatar: campaign.creator?.avatar_url || '/placeholder-user.jpg',
        campaigns: 0, // This would need to be calculated separately
        followers: 0, // This would need to be calculated separately
      },
      image: campaign.featured_image_url || (campaign.images && campaign.images.length > 0 ? campaign.images[0] : '/campaign-water-well.jpg'),
      video: campaign.video_url,
      raised: campaign.current_amount,
      goal: campaign.goal_amount,
      supporters: campaign.supporters_count || 0,
      daysLeft,
      category: campaign.category,
      story: campaign.story,
      updates: [], // This would need to be fetched separately
      comments: campaign.comments_count || 0,
      description: campaign.description,
      images: campaign.images || [],
      is_featured: campaign.is_featured,
      is_verified: campaign.is_verified,
      status: campaign.status,
      created_at: campaign.created_at,
      end_date: campaign.end_date,
    }

    return (
      <main className="min-h-screen bg-background">
        <ExploreHeader />
        <div className="container mx-auto px-4 py-6">
          <CampaignHero campaign={campaignData} />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CampaignTabs campaign={campaignData} />
            </div>
            <div className="space-y-6">
              <CampaignStats campaign={campaignData} />
              <CampaignActions campaignId={campaign.id} />
              <DonorList campaignId={campaign.id} />
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error fetching campaign:', error)
    notFound()
  }
}