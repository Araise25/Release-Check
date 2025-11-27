"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Bookmark, Copy, Check } from "lucide-react"
import type { Technology } from "@/app/page"
import { useState } from "react"

type TechCardProps = {
  technology: Technology
  isBookmarked: boolean
  onToggleBookmark: (name: string) => void
}

const categoryColors = {
  tech: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  framework: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  "ai-tools": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  cloud: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
}

export function TechCard({ technology, isBookmarked, onToggleBookmark }: TechCardProps) {
  const [copied, setCopied] = useState(false)

  const currentYear = new Date().getFullYear()
  const maxExperience = currentYear - technology.release_year

  const copyExperienceMessage = () => {
    const message = `Maximum realistic experience in ${technology.name} is ${maxExperience} years (released in ${technology.release_year}).`
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-border/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="text-2xl font-semibold text-foreground">{technology.name}</h3>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-sm">Released: {technology.release_year}</span>
            <span className="text-sm font-medium text-foreground">Max Experience: {maxExperience} years</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyExperienceMessage}
            className="shrink-0"
            title="Copy experience message"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy experience message</span>
          </Button>

          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <a href={technology.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Visit website</span>
            </a>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => onToggleBookmark(technology.name)} className="shrink-0">
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
            <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Add bookmark"}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
