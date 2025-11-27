"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Technology } from "@/app/page"
import { TechCard } from "@/components/tech-card"

type BookmarksDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarkedTechnologies: Technology[]
  onToggleBookmark: (name: string) => void
}

export function BookmarksDialog({
  open,
  onOpenChange,
  bookmarkedTechnologies,
  onToggleBookmark,
}: BookmarksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Bookmarks</DialogTitle>
          <DialogDescription>
            {bookmarkedTechnologies.length === 0
              ? "You haven't bookmarked any technologies yet."
              : `${bookmarkedTechnologies.length} bookmarked ${bookmarkedTechnologies.length === 1 ? "technology" : "technologies"}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {bookmarkedTechnologies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Bookmark technologies you frequently need to fact-check!</p>
            </div>
          ) : (
            bookmarkedTechnologies.map((tech) => (
              <TechCard key={tech.name} technology={tech} isBookmarked={true} onToggleBookmark={onToggleBookmark} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
