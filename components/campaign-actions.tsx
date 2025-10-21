"use client"

import { Button } from "@/components/ui/button"
import { Heart, Share2, Flag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface CampaignActionsProps {
  campaignId: string
}

export function CampaignActions({ campaignId }: CampaignActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Link href={`/donate/${campaignId}`}>
        <Button size="lg" className="w-full rounded-xl text-base font-semibold shadow-lg">
          Donate Now
        </Button>
      </Link>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={isFollowing ? "default" : "outline"}
          size="lg"
          className="rounded-xl"
          onClick={() => setIsFollowing(!isFollowing)}
        >
          <Heart className={`h-4 w-4 ${isFollowing ? "fill-current" : ""}`} />
        </Button>
        <Button variant="outline" size="lg" className="rounded-xl bg-transparent">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg" className="rounded-xl bg-transparent">
          <Flag className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
