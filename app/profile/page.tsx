"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Edit, LogOut } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CampaignWithCreator } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [userCampaigns, setUserCampaigns] = useState<CampaignWithCreator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserCampaigns()
    }
  }, [user])

  const fetchUserCampaigns = async () => {
    try {
      const response = await fetch(`/api/campaigns?creator_id=${user?.id}`)
      if (response.ok) {
        const campaigns = await response.json()
        setUserCampaigns(campaigns)
      }
    } catch (error) {
      console.error('Error fetching user campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your profile.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profile?.avatar_url || ""} alt={user.profile?.full_name || ""} />
                  <AvatarFallback className="text-lg">
                    {user.profile?.full_name?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.profile?.full_name || "User"}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">
                      {user.profile?.role || 'user'}
                    </Badge>
                    {user.profile?.is_verified && (
                      <Badge variant="default" className="bg-green-500">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Details */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.profile?.phone_number && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.profile.phone_number}</span>
                    </div>
                  )}
                  {user.profile?.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(user.profile?.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {user.profile?.bio && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Bio</h3>
                      <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
                    </div>
                  </>
                )}
              </Card>
            </div>

            {/* Campaigns */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">My Campaigns</h2>
                  <Button asChild>
                    <Link href="/create">
                      <User className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Link>
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading campaigns...</p>
                  </div>
                ) : userCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first campaign to start fundraising.
                    </p>
                    <Button asChild>
                      <Link href="/create">Create Campaign</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {campaign.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatCurrency(campaign.current_amount)} raised</span>
                              <span>{(campaign as any).supporters_count || 0} supporters</span>
                              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/campaign/${campaign.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
