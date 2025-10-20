import { DonationForm } from "@/components/donation-form"
import { DonationSummary } from "@/components/donation-summary"
import { ExploreHeader } from "@/components/explore-header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock campaign data
const campaignData = {
  id: 1,
  title: "Clean Water for Rural Communities",
  creator: "Water for Life Foundation",
  image: "/campaign-water-well.jpg",
  raised: 2500000,
  goal: 5000000,
}

export default function DonatePage() {
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
}
