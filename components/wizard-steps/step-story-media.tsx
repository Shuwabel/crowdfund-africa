"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, X } from "lucide-react"
import { useState, useRef } from "react"

interface StepStoryMediaProps {
  formData: { story: string; images: string[] }
  updateFormData: (data: Partial<{ story: string; images: string[] }>) => void
}

export function StepStoryMedia({ formData, updateFormData }: StepStoryMediaProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      updateFormData({ images: [...formData.images, ...uploadedUrls] })
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    updateFormData({ images: newImages })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tell your story</h2>
        <p className="mt-2 text-muted-foreground">Share why this campaign matters and how funds will be used</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="story">Campaign Story</Label>
          <Textarea
            id="story"
            placeholder="Share your story... Why is this important? Who will benefit? How will the funds be used?"
            value={formData.story}
            onChange={(e) => updateFormData({ story: e.target.value })}
            className="min-h-[200px] rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Be honest and specific. Include details about your plan.</p>
        </div>

        <div className="space-y-2">
          <Label>Campaign Images</Label>
          
          {/* Upload Area */}
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Upload campaign images</p>
                <p className="text-xs text-muted-foreground">Add photos that show your cause and build trust</p>
              </div>
              <Button 
                variant="outline" 
                className="rounded-xl bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Campaign image ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
