"use client"

import { useState } from "react"
import { Heart, GraduationCap, Briefcase, Users, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "health", label: "Health", icon: Heart },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "community", label: "Community", icon: Users },
  { id: "emergency", label: "Emergency", icon: AlertCircle },
]

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className="flex-shrink-0 rounded-xl"
            onClick={() => setActiveCategory(category.id)}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
