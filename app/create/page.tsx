import { CreateCampaignWizard } from "@/components/create-campaign-wizard"
import { ExploreHeader } from "@/components/explore-header"

export default function CreateCampaignPage() {
  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold text-foreground">Create Your Campaign</h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Share your story and start making a difference in your community
            </p>
          </div>
          <CreateCampaignWizard />
        </div>
      </div>
    </main>
  )
}
