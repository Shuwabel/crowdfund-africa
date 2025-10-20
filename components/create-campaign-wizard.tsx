"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StepBasicInfo } from "@/components/wizard-steps/step-basic-info"
import { StepStoryMedia } from "@/components/wizard-steps/step-story-media"
import { StepGoalDuration } from "@/components/wizard-steps/step-goal-duration"
import { StepPaymentAccount } from "@/components/wizard-steps/step-payment-account"
import { StepPreview } from "@/components/wizard-steps/step-preview"

const steps = [
  { id: 1, title: "Basic Info", component: StepBasicInfo },
  { id: 2, title: "Story & Media", component: StepStoryMedia },
  { id: 3, title: "Goal & Duration", component: StepGoalDuration },
  { id: 4, title: "Payment Account", component: StepPaymentAccount },
  { id: 5, title: "Preview", component: StepPreview },
]

export function CreateCampaignWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    story: "",
    images: [],
    goal: "",
    duration: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
  })

  const progress = (currentStep / steps.length) * 100
  const CurrentStepComponent = steps[currentStep - 1].component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="rounded-2xl p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-muted-foreground">{steps[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Step Content */}
      <Card className="rounded-2xl p-8">
        <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="rounded-xl bg-transparent"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button size="lg" onClick={handleNext} disabled={currentStep === steps.length} className="rounded-xl">
          {currentStep === steps.length ? "Publish Campaign" : "Continue"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
