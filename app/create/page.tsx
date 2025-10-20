"use client"

import { CreateCampaignWizard } from "@/components/create-campaign-wizard"
import { ExploreHeader } from "@/components/explore-header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateCampaignPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <ExploreHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl text-center">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return null // Will redirect
  }

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
