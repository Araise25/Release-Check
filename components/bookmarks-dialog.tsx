"use client"

import { useEffect } from "react"
import { Bookmark, X } from "lucide-react"
import { Technology } from "@/lib/types"

type BookmarksDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarkedTechnologies: Technology[]
  onToggleBookmark: (name: string) => void
  onClearBookmarks: () => void
  darkMode: boolean
}

export function BookmarksDialog({
  open,
  onOpenChange,
  bookmarkedTechnologies,
  onToggleBookmark,
  onClearBookmarks,
  darkMode,
}: BookmarksDialogProps) {
  // Handle ESC key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
          <div>
            <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Bookmarked Technologies
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {bookmarkedTechnologies.length} {bookmarkedTechnologies.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bookmarkedTechnologies.length > 0 && (
              <button
                onClick={onClearBookmarks}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${darkMode
                  ? 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/50'
                  : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
          {bookmarkedTechnologies.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={`text-lg font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No bookmarks yet</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Bookmark technologies from the main page to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedTechnologies.map((tech) => {
                const currentYear = new Date().getFullYear()
                const yearsOld = currentYear - tech.release_year

                // Color coding based on age - Bold, eye-catching colors (matching main page)
                const getAgeBadgeColor = () => {
                  if (yearsOld < 3) return darkMode ? 'from-lime-400 to-green-500' : 'from-lime-500 to-green-600'
                  if (yearsOld < 7) return darkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-500 to-blue-600'
                  if (yearsOld < 15) return darkMode ? 'from-orange-400 to-red-500' : 'from-orange-500 to-red-600'
                  return darkMode ? 'from-purple-400 to-violet-500' : 'from-purple-500 to-violet-600'
                }

                return (
                  <div key={tech.name} className="group relative">
                    {/* Gradient border effect */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-r ${getAgeBadgeColor()} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`}></div>

                    <div className={`relative rounded-xl p-6 transition-all duration-300 ${darkMode
                      ? 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800'
                      : 'bg-white/90 backdrop-blur-xl border border-slate-200/50 hover:bg-white'
                      } group-hover:shadow-2xl group-hover:scale-[1.02] group-hover:-translate-y-1`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} selection:bg-red-900/60 selection:text-red-100`}>
                            {tech.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                              ? 'bg-slate-900/50 border-slate-600/50'
                              : 'bg-slate-50 border-slate-200'
                              }`}>
                              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {tech.category}
                              </span>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                              ? 'bg-slate-900/50 border-slate-600/50'
                              : 'bg-slate-50 border-slate-200'
                              }`}>
                              <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                📅 {tech.release_year}
                              </span>
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                              ? 'bg-slate-900/50 border-slate-600/50'
                              : 'bg-slate-50 border-slate-200'
                              }`}>
                              <span className={`text-sm font-semibold bg-gradient-to-r ${getAgeBadgeColor()} bg-clip-text text-transparent`}>
                                {yearsOld} years old
                              </span>
                            </div>
                          </div>
                          <a
                            href={tech.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${getAgeBadgeColor()} bg-clip-text text-transparent hover:gap-3 transition-all duration-300 group/link`}
                          >
                            <span>Learn more</span>
                            <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                          </a>
                        </div>
                        <button
                          onClick={() => onToggleBookmark(tech.name)}
                          className={`relative p-3 rounded-xl transition-all duration-300 ${darkMode
                            ? 'bg-slate-700 text-amber-400/80 hover:text-amber-400 hover:bg-slate-600'
                            : 'bg-slate-200 text-amber-600/80 hover:text-amber-600 hover:bg-slate-300'
                            }`}
                        >
                          <Bookmark className="w-5 h-5" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
