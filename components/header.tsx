"use client"

import { Moon, Sun, Bookmark } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

type HeaderProps = {
  onBookmarksClick: () => void
}

export function Header({ onBookmarksClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" disabled>
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Sun className="h-5 w-5" />
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={onBookmarksClick} className="relative">
          <Bookmark className="h-5 w-5" />
          <span className="sr-only">View bookmarks</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
