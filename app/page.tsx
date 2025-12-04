"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Bookmark, X, Quote } from "lucide-react"
import { Header } from "@/components/header"
import { useTheme } from "next-themes"
import { getInvalidDialogues, validDialogues } from "@/lib/dialogues"
import { Technology } from "@/lib/types"
import { fetchTechnologies } from "@/lib/data"
import { BookmarksDialog } from "@/components/bookmarks-dialog"
import { useBookmarks } from "@/hooks/use-bookmarks"



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

function SearchBar({ value, onChange, onClear, darkMode }: { value: string; onChange: (value: string) => void; onClear: () => void; darkMode: boolean }) {
  return (
    <div className="relative max-w-lg mx-auto w-full group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#101820] to-[#F2AA4C] rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500`}></div>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Try "LangChain 10" or "React 5"...'
          className={`w-full pl-12 pr-12 py-4 border rounded-xl shadow-lg focus:outline-none transition-all duration-300 ${darkMode
            ? 'bg-slate-900/60 backdrop-blur-xl border-slate-700/50 text-white placeholder-slate-400 focus:bg-slate-900/80'
            : 'bg-white/60 backdrop-blur-xl border-white/50 text-slate-900 placeholder-slate-500 focus:bg-white/80'
            }`}
        />
        {value && (
          <button
            onClick={onClear}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${darkMode
              ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
              : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
              }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
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
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`px-3 py-1.5 rounded-lg border ${darkMode
                ? 'bg-slate-900/50 border-slate-600/50'
                : 'bg-slate-50 border-slate-200'
                }`}>
                <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {technology.category}
                </span>
              </div>
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



// --- Main Page ---

export default function HomePage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks()
  const [loading, setLoading] = useState(true)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(technologies.map(t => t.category)))
    return ["All", ...uniqueCategories.sort()]
  }, [technologies])

  const filteredTechnologies = useMemo(() => {
    let filtered = technologies

    // 1. Filter by Category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(t => t.category === selectedCategory)
    } else if (!selectedCategory) {
      // If no category selected, show nothing (except if searching? The requirement says "Remove all... show categories... click category -> show respective")
      // But if I want to support "All" category, I should probably default to showing nothing or showing all if "All" is selected.
      // Let's assume initial state is null -> show nothing.
      // If "All" is selected -> show all.
      // But wait, if I search, I should probably show results regardless of category?
      // Let's make search override category selection if search is present.
    }

    if (!searchQuery.trim()) {
      setValidationResult(null)
      // If no search and no category selected (or "All" not selected explicitly), show nothing?
      // The prompt says: "Remove all the technologies from the main page and show the categories and when the User click on the category it will show up the respective technologies"
      // So if selectedCategory is null, return empty array.
      if (!selectedCategory) return []
      return filtered
    }

    const query = searchQuery.toLowerCase().trim()

    // If searching, we search within the filtered list (if a category is selected) OR all if "All" is selected?
    // Actually, usually search is global. Let's make search global for better UX, or scoped to category?
    // "add an ALL category as well to show all the technologies"
    // I will make search filter the *currently selected category* (which includes "All").
    // If no category is selected, I'll auto-select "All" or just search globally.
    // Let's stick to: Search filters the `filtered` list.
    // If `selectedCategory` is null, I should probably NOT return empty if there is a search query?
    // Let's say: if search query exists, ignore category selection (search global).
    // Or better: If search query exists, we search globally.

    if (searchQuery.trim()) {
      filtered = technologies // Reset to all for global search
    }

    const match = query.match(/^(.+?)\s+(\d+)$/)

    if (match) {
      const [, techName, yearsStr] = match
      const requestedYears = parseInt(yearsStr, 10)
      const tech = filtered.find((t) =>
        t.name.toLowerCase().includes(techName.trim()) ||
        t.aliases?.some(alias => alias.toLowerCase().includes(techName.trim()))
      )

      if (tech) {
        const currentYear = new Date().getFullYear()
        const maxPossibleYears = currentYear - tech.release_year
        const isValid = requestedYears <= maxPossibleYears
        const isMatch = true // We found it

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

    return filtered.filter((tech) =>
      tech.name.toLowerCase().includes(query) ||
      tech.aliases?.some(alias => alias.toLowerCase().includes(query))
    )
  }, [technologies, searchQuery, selectedCategory])



  const bookmarkedTechnologies = technologies.filter((tech) => bookmarks.has(tech.name))

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#101820]' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <Header
        onBookmarksClick={() => setShowBookmarks(true)}
        bookmarkCount={bookmarks.size}
      />

      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 max-w-5xl flex flex-col items-center justify-center">
        <div className="w-full space-y-8 animate-in fade-in duration-500">
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!selectedCategory && !searchQuery.trim() ? 'max-h-[500px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
            <div className="text-center space-y-3">
              <h1 className={`text-6xl font-black tracking-tight ${darkMode
                ? 'text-white drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]'
                : 'text-slate-900'
                } relative`}>
                <span className="relative inline-block">
                  Release
                  <span className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#101820] to-[#F2AA4C]`}></span>
                </span>
                {' '}
                <span className={`text-[#F2AA4C] font-black`}>Check</span>
              </h1>
              <p className={`text-lg font-semibold text-[#F2AA4C]`}>
                Fact-check job descriptions with realistic experience requirements
              </p>
            </div>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            darkMode={darkMode}
          />

          {/* Category Filters */}
          {!loading && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === category
                    ? 'bg-[#F2AA4C] text-[#101820] shadow-[0_0_15px_rgba(242,170,76,0.5)]'
                    : darkMode
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

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

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {filteredTechnologies.length > 0 ? (
                  filteredTechnologies.map((tech) => (
                    <TechCard
                      key={tech.name}
                      technology={tech}
                      isBookmarked={bookmarks.has(tech.name)}
                      onToggleBookmark={toggleBookmark}
                      darkMode={darkMode}
                    />
                  ))
                ) : (
                  !loading && (
                    <div className="col-span-1 md:col-span-2 text-center opacity-50">
                      <p className="text-lg">
                        {selectedCategory
                          ? "No technologies found in this category matching your search."
                          : "Select a category to view technologies."}
                      </p>
                    </div>
                  )
                )}
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
        onClearBookmarks={clearBookmarks}
        darkMode={darkMode}
      />
    </div>
  )
}
