"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, FileText, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommentsSection } from "@/components/comments-section"

interface CampaignTabsProps {
  campaign: {
    id: string
    story: string
    updates: Array<{
      id: number
      date: string
      title: string
      content: string
    }>
    comments: number
  }
}

export function CampaignTabs({ campaign }: CampaignTabsProps) {
  const [activeTab, setActiveTab] = useState("story")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 rounded-xl">
        <TabsTrigger value="story" className="rounded-lg">
          <FileText className="mr-2 h-4 w-4" />
          Story
        </TabsTrigger>
        <TabsTrigger value="updates" className="rounded-lg">
          <Bell className="mr-2 h-4 w-4" />
          Updates ({campaign.updates.length})
        </TabsTrigger>
        <TabsTrigger value="comments" className="rounded-lg">
          <MessageSquare className="mr-2 h-4 w-4" />
          Comments ({campaign.comments})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="story" className="mt-6">
        <Card className="rounded-2xl p-6">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-base leading-relaxed text-foreground">{campaign.story}</div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="updates" className="mt-6 space-y-4">
        {campaign.updates.map((update) => (
          <Card key={update.id} className="rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{update.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="leading-relaxed text-foreground">{update.content}</p>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="comments" className="mt-6">
        <CommentsSection campaignId={campaign.id} />
      </TabsContent>
    </Tabs>
  )
}
