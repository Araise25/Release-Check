"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertTriangle, Search, Moon, Sun, Bookmark, Code } from "lucide-react"
import { useTheme } from "next-themes"

export function Header({
  onBookmarksClick
}: {
  onBookmarksClick?: () => void;
}) {
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  // Prevent hydration mismatch by rendering a placeholder or simpler version until mounted
  // For the header, we can just render the structure but maybe avoid theme-specific classes if critical,
  // or just accept a small flash. However, next-themes usually handles class application on html tag.
  // We need `mounted` mainly for the icon toggle.

  if (!mounted) {
    return (
      <header className="border-b shadow-sm sticky top-0 z-30 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Release Check</h2>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`border-b sticky top-0 z-30 ${isDark
      ? 'border-slate-800 bg-slate-900'
      : 'border-slate-200 bg-white'
      } shadow-sm`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="group relative">
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} transition-all`}>
              <span className="relative">
                Release
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isDark ? 'bg-gradient-to-r from-lime-400 to-cyan-400' : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}></span>
              </span>
              {' '}
              <span className={isDark ? 'text-cyan-400' : 'text-orange-600'}>Check</span>
            </h2>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/jd-parser"
              className={`group relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${pathname === '/jd-parser'
                ? isDark
                  ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
            >
              <Code className="w-4 h-4" />
              JD Parser
            </Link>
            <Link
              href="/wall-of-shame"
              className={`group relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${pathname === '/wall-of-shame'
                ? isDark
                  ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Wall of Shame
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isDark
              ? 'hover:bg-slate-800 text-slate-300 hover:text-yellow-400 hover:scale-110'
              : 'hover:bg-slate-100 text-slate-700 hover:text-indigo-600 hover:scale-110'
              }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Only show bookmarks button on main page if needed, or pass prop */}
          {onBookmarksClick && (
            <button
              onClick={onBookmarksClick}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isDark
                ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-amber-400 hover:scale-105'
                : 'bg-slate-100/50 text-slate-700 hover:bg-slate-200 hover:text-amber-600 hover:scale-105'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden flex p-3 border-t justify-center gap-2 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        }`}>
        <Link
          href="/jd-parser"
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${pathname === '/jd-parser'
            ? isDark
              ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-900 shadow-lg'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
            : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          JD Parser
        </Link>
        <Link
          href="/wall-of-shame"
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${pathname === '/wall-of-shame'
            ? isDark
              ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-900 shadow-lg'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
            : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          Wall of Shame
        </Link>
      </div>
    </header>
  )
}