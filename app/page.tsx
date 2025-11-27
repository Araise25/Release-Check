"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Bookmark, X, Quote } from "lucide-react"
import { Header } from "@/components/header"
import { useTheme } from "next-themes"
import { getInvalidDialogues, validDialogues } from "@/lib/dialogues"
import { Technology } from "@/lib/types"
import { fetchTechnologies } from "@/lib/data"



export type ValidationResult = {
  technology: Technology
  requestedYears: number
  maxPossibleYears: number
  isValid: boolean
}

// --- Components ---

function SarcasticRotator({ isValid, techName, requested, max }: { isValid: boolean; techName: string; requested: number; max: number }) {
  // Selects a random message ONLY when the inputs (search result) change.
  const message = useMemo(() => {
    const invalidList = getInvalidDialogues(techName, requested, max)
    const targetList = isValid ? validDialogues : invalidList
    const randomIndex = Math.floor(Math.random() * targetList.length)
    return targetList[randomIndex]
  }, [isValid, techName, requested, max])

  return (
    <div className="flex items-start gap-3 mt-2 min-h-[60px]">
      <Quote className={`w-6 h-6 flex-shrink-0 opacity-50 ${isValid ? 'text-emerald-600' : 'text-rose-600'}`} />
      <p className={`text-lg font-medium italic animate-in fade-in slide-in-from-bottom-2 duration-500`}>
        {message}
      </p>
    </div>
  )
}

function SearchBar({ value, onChange, darkMode }: { value: string; onChange: (value: string) => void; darkMode: boolean }) {
  return (
    <div className="relative">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Try "LangChain 10" or "React 5"...'
        className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode
          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
          }`}
      />
    </div>
  )
}

function TechCard({
  technology,
  isBookmarked,
  onToggleBookmark,
  darkMode,
}: {
  technology: Technology
  isBookmarked: boolean
  onToggleBookmark: (name: string) => void
  darkMode?: boolean
}) {
  const currentYear = new Date().getFullYear()
  const yearsOld = currentYear - technology.release_year

  // Color coding based on age - Bold, eye-catching colors
  const getAgeBadgeColor = () => {
    if (yearsOld < 3) return darkMode ? 'from-lime-400 to-green-500' : 'from-lime-500 to-green-600' // Razor green
    if (yearsOld < 7) return darkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-500 to-blue-600' // Electric cyan
    if (yearsOld < 15) return darkMode ? 'from-orange-400 to-red-500' : 'from-orange-500 to-red-600' // Vibrant orange/red
    return darkMode ? 'from-purple-400 to-violet-500' : 'from-purple-500 to-violet-600' // Purple/Violet
  }


  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${getAgeBadgeColor()} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`}></div>

      <div className={`relative rounded-xl p-6 transition-all duration-300 ${darkMode
        ? 'bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800'
        : 'bg-white/90 backdrop-blur-xl border border-slate-200/50 hover:bg-white'
        } group-hover:shadow-2xl group-hover:scale-[1.02] group-hover:-translate-y-1`}>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Header with name and age badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} transition-all duration-300 selection:bg-red-900/60 selection:text-red-100`}>
                {technology.name}
              </h3>
            </div>

            {/* Release info with enhanced styling */}
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                ? 'bg-slate-900/50 border-slate-600/50'
                : 'bg-slate-50 border-slate-200'
                }`}>
                <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  📅 {technology.release_year}
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

            {/* Learn more link with enhanced hover effect */}
            <a
              href={technology.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${getAgeBadgeColor()} bg-clip-text text-transparent hover:gap-3 transition-all duration-300 group/link`}
            >
              <span>Learn more</span>
              <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* Bookmark button with subtle styling */}
          <button
            onClick={() => onToggleBookmark(technology.name)}
            className={`relative p-3 rounded-xl transition-all duration-300 ${isBookmarked
              ? darkMode
                ? 'bg-slate-700 text-amber-400/80 hover:text-amber-400 hover:bg-slate-600'
                : 'bg-slate-200 text-amber-600/80 hover:text-amber-600 hover:bg-slate-300'
              : darkMode
                ? 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50 hover:text-slate-400'
                : 'bg-slate-100/50 text-slate-400 hover:bg-slate-200/50 hover:text-slate-500'
              }`}
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  )
}

function BookmarksDialog({
  open,
  onOpenChange,
  bookmarkedTechnologies,
  onToggleBookmark,
  darkMode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookmarkedTechnologies: Technology[]
  onToggleBookmark: (name: string) => void
  darkMode: boolean
}) {
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
          <button
            onClick={() => onOpenChange(false)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
          {bookmarkedTechnologies.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={`text-lg font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No bookmarks yet</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Start bookmarking technologies to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedTechnologies.map((tech) => (
                <TechCard
                  key={tech.name}
                  technology={tech}
                  isBookmarked={true}
                  onToggleBookmark={onToggleBookmark}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---

export default function HomePage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  // NOTE: In a real app, move Dark Mode to a Context Provider (like next-themes)
  // so it persists between this page and the Wall of Shame page.
  // const [darkMode, setDarkMode] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const darkMode = mounted && currentTheme === 'dark'

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchTechnologies()
        setTechnologies(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) {
      setValidationResult(null)
      return technologies
    }

    const query = searchQuery.toLowerCase().trim()
    const match = query.match(/^(.+?)\s+(\d+)$/)

    if (match) {
      const [, techName, yearsStr] = match
      const requestedYears = parseInt(yearsStr, 10)
      const tech = technologies.find((t) =>
        t.name.toLowerCase().includes(techName.trim()) ||
        t.aliases?.some(alias => alias.toLowerCase().includes(techName.trim()))
      )

      if (tech) {
        const currentYear = new Date().getFullYear()
        const maxPossibleYears = currentYear - tech.release_year
        const isValid = requestedYears <= maxPossibleYears

        setValidationResult({
          technology: tech,
          requestedYears,
          maxPossibleYears,
          isValid,
        })
        return [tech]
      }
    } else {
      setValidationResult(null)
    }
    return technologies.filter((tech) =>
      tech.name.toLowerCase().includes(query) ||
      tech.aliases?.some(alias => alias.toLowerCase().includes(query))
    )
  }, [technologies, searchQuery])

  const toggleBookmark = (name: string) => {
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(name)) newBookmarks.delete(name)
      else newBookmarks.add(name)
      return newBookmarks
    })
  }

  const bookmarkedTechnologies = technologies.filter((tech) => bookmarks.has(tech.name))

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <Header
        onBookmarksClick={() => setShowBookmarks(true)}
      />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="w-full space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-3 mb-12">
            <h1 className={`text-6xl font-black tracking-tight ${darkMode
              ? 'text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]'
              : 'text-slate-900'
              } relative`}>
              <span className="relative">
                Release
                <span className={`absolute -bottom-2 left-0 w-full h-1 ${darkMode ? 'bg-gradient-to-r from-lime-400 to-cyan-400' : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}></span>
              </span>
              {' '}
              <span className={`${darkMode ? 'text-cyan-400' : 'text-orange-600'
                } font-black`}>Check</span>
            </h1>
            <p className={`text-lg font-semibold ${darkMode ? 'text-cyan-400' : 'text-orange-600'}`}>
              Fact-check job descriptions with realistic experience requirements
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              💡 Try: <span className={`font-mono px-2 py-1 rounded border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>Python 5</span> or{" "}
              <span className={`font-mono px-2 py-1 rounded border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>LangChain 10</span>
            </p>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} darkMode={darkMode} />

          {loading ? (
            <div className="text-center py-12">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {validationResult && (
                <div
                  className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-300 ${validationResult.isValid
                    ? darkMode ? "bg-emerald-900/30 border-emerald-500" : "bg-emerald-50 border-emerald-400"
                    : darkMode ? "bg-rose-900/30 border-rose-500" : "bg-rose-50 border-rose-400"
                    }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 pb-4">
                      <span className="text-3xl">{validationResult.isValid ? "✅" : "🤡"}</span>
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {validationResult.isValid ? "Valid Requirement" : "Impossible Requirement"}
                        </h3>
                      </div>
                    </div>

                    {/* ROTATING SARCASTIC DIALOGUES */}
                    <div className={`${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      <SarcasticRotator
                        isValid={validationResult.isValid}
                        techName={validationResult.technology.name}
                        requested={validationResult.requestedYears}
                        max={validationResult.maxPossibleYears}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mt-2">
                      <div className={`p-4 rounded-lg border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        <p className={`mb-1 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Release Year</p>
                        <p className={`font-bold text-2xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>{validationResult.technology.release_year}</p>
                      </div>
                      <div className={`p-4 rounded-lg border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        <p className={`mb-1 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Max Possible</p>
                        <p className={`font-bold text-2xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>{validationResult.maxPossibleYears} years</p>
                      </div>
                      <div className={`p-4 rounded-lg border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        <p className={`mb-1 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Requested</p>
                        <p className={`font-bold text-2xl ${validationResult.isValid
                          ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                          : (darkMode ? 'text-rose-400' : 'text-rose-600')
                          }`}>{validationResult.requestedYears} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {filteredTechnologies.map((tech) => (
                  <TechCard
                    key={tech.name}
                    technology={tech}
                    isBookmarked={bookmarks.has(tech.name)}
                    onToggleBookmark={toggleBookmark}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <BookmarksDialog
        open={showBookmarks}
        onOpenChange={setShowBookmarks}
        bookmarkedTechnologies={bookmarkedTechnologies}
        onToggleBookmark={toggleBookmark}
        darkMode={darkMode}
      />
    </div>
  )
}