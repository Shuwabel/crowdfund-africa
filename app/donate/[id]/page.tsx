import { DonationForm } from "@/components/donation-form"
import { DonationSummary } from "@/components/donation-summary"
import { ExploreHeader } from "@/components/explore-header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCampaignById } from "@/lib/campaigns"
import { notFound } from "next/navigation"

interface DonatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DonatePage({ params }: DonatePageProps) {
  const { id } = await params
  
  try {
    const campaign = await getCampaignById(id)
    
    if (!campaign) {
      notFound()
    }

    // Transform campaign data to match component expectations
    const campaignData = {
      id: campaign.id,
      title: campaign.title,
      creator: campaign.creator?.full_name || 'Anonymous',
      image: campaign.featured_image_url || (campaign.images && campaign.images.length > 0 ? campaign.images[0] : '/campaign-water-well.jpg'),
      raised: campaign.current_amount,
      goal: campaign.goal_amount,
    }

    return (
      <main className="min-h-screen bg-background">
        <ExploreHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Link href={`/campaign/${campaignData.id}`}>
              <Button variant="ghost" className="mb-6 rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaign
              </Button>
            </Link>

            <div className="mb-6 text-center">
              <h1 className="text-balance text-3xl font-bold text-foreground">Support This Campaign</h1>
              <p className="mt-2 text-pretty text-muted-foreground">Every contribution makes a difference</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DonationForm campaignId={campaignData.id} />
              </div>
              <div>
                <DonationSummary campaign={campaignData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error fetching campaign for donation:', error)
    notFound()
  }
}