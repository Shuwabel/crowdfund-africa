"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Heart, Sparkles, Users } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    icon: Sparkles,
    title: "Start a cause",
    description: "Share your story and create a campaign that matters to your community",
    image: "/african-community-helping-each-other.jpg",
  },
  {
    icon: Heart,
    title: "Support a dream",
    description: "Discover meaningful campaigns and make a difference with your contribution",
    image: "/african-people-celebrating-success.jpg",
  },
  {
    icon: Users,
    title: "Change a life",
    description: "Join thousands making real impact across African communities",
    image: "/african-community-empowerment.jpg",
  },
]

export function OnboardingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">FundAfrica</h1>
          <p className="text-sm text-muted-foreground">Together we rise</p>
        </div>

        {/* Slide Content */}
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl bg-card shadow-lg">
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <Icon className="h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-3 px-4">
            <h2 className="text-balance text-2xl font-bold leading-tight text-foreground">{slide.title}</h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">{slide.description}</p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          {currentSlide === slides.length - 1 ? (
            <Link href="/explore" className="block">
              <Button size="lg" className="w-full rounded-xl text-base font-semibold shadow-lg">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={nextSlide} className="w-full rounded-xl text-base font-semibold shadow-lg">
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {currentSlide < slides.length - 1 && (
            <Link href="/explore">
              <Button variant="ghost" size="lg" className="w-full rounded-xl text-base">
                Skip
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
