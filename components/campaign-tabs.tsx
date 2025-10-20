"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, FileText, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CampaignTabsProps {
  campaign: {
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
        <Card className="rounded-2xl p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 border-b pb-4 last:border-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">User {i}</span>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    This is such an important cause. Thank you for the work you're doing!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
