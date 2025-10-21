import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart } from "lucide-react"

interface DonorListProps {
  campaignId: string
}

const recentDonors = [
  { name: "Chioma A.", amount: 50000, time: "2 hours ago", anonymous: false },
  { name: "Anonymous", amount: 100000, time: "5 hours ago", anonymous: true },
  { name: "Tunde O.", amount: 25000, time: "1 day ago", anonymous: false },
  { name: "Amina K.", amount: 75000, time: "1 day ago", anonymous: false },
  { name: "Anonymous", amount: 150000, time: "2 days ago", anonymous: true },
]

export function DonorList({ campaignId }: DonorListProps) {
  return (
    <Card className="rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recent Supporters</h3>
      </div>
      <div className="space-y-3">
        {recentDonors.map((donor, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {donor.anonymous ? "?" : donor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{donor.name}</p>
              <p className="text-xs text-muted-foreground">{donor.time}</p>
            </div>
            <span className="text-sm font-semibold text-primary">₦{(donor.amount / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
