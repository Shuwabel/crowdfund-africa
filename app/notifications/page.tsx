"use client"

import { ExploreHeader } from "@/components/explore-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Heart, MessageSquare, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

const mockNotifications = [
  {
    id: 1,
    type: "donation",
    title: "New donation received!",
    message: "Chioma A. donated ₦50,000 to your 'Clean Water for Rural Communities' campaign",
    timestamp: "2 hours ago",
    read: false,
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on your campaign",
    message: "Tunde O. commented: 'This is such an important cause. Keep up the great work!'",
    timestamp: "5 hours ago",
    read: false,
    icon: MessageSquare,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "follow",
    title: "Someone followed your campaign",
    message: "Amina K. started following your 'Clean Water for Rural Communities' campaign",
    timestamp: "1 day ago",
    read: true,
    icon: Heart,
    color: "text-red-600"
  },
  {
    id: 4,
    type: "milestone",
    title: "Campaign milestone reached!",
    message: "Congratulations! Your campaign has reached 50% of its funding goal",
    timestamp: "2 days ago",
    read: true,
    icon: CheckCircle,
    color: "text-purple-600"
  },
  {
    id: 5,
    type: "update",
    title: "Campaign update posted",
    message: "You posted an update to your 'Clean Water for Rural Communities' campaign",
    timestamp: "3 days ago",
    read: true,
    icon: Bell,
    color: "text-orange-600"
  }
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <ExploreHeader />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view notifications</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to see your notifications</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <ExploreHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  When you receive donations, comments, or other updates, they'll appear here.
                </p>
              </Card>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <Card 
                    key={notification.id} 
                    className={`p-4 transition-all hover:shadow-md ${
                      !notification.read ? 'border-primary/20 bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
