"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertTriangle, Search, Moon, Sun, Bookmark, Code, Home } from "lucide-react"
import { useTheme } from "next-themes"

export function Header({
  onBookmarksClick,
  bookmarkCount = 0,
  onAddTechClick
}: {
  onBookmarksClick?: () => void;
  bookmarkCount?: number;
  onAddTechClick?: () => void;
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
      <header className="sticky top-0 z-30">
        <div className="container mx-auto px-4 py-2 md:py-3 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white hidden md:block">Release Check</h2>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white md:hidden">RC</h2>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30">
      <div className="container mx-auto px-4 py-2 md:py-4 flex items-center justify-between max-w-5xl">
        {/* Logo - Hidden on mobile */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="group relative hidden md:flex items-center gap-3">
            <Image src="/icon-32x32.png" alt="Release Check Logo" width={32} height={32} className="w-8 h-8" />
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} transition-all`}>
              <span className="relative">
                Release
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-gradient-to-r from-[#101820] to-[#F2AA4C]`}></span>
              </span>
              {' '}
              <span className={`text-[#F2AA4C]`}>Check</span>
            </h2>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/jd-parser"
              className={`group relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 
      ${pathname === '/jd-parser'
                  ? 'bg-[#F2AA4C] text-black'
                  : `hover:bg-[#F2AA4C] hover:text-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`
                }`}
            >
              <Code className="w-4 h-4" />
              JD Parser
            </Link>

            <Link
              href="/wall-of-shame"
              className={`group relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 
      ${pathname === '/wall-of-shame'
                  ? 'bg-[#F2AA4C] text-black'
                  : `hover:bg-[#F2AA4C] hover:text-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`
                }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Wall of Shame
            </Link>

            {onAddTechClick && (
              <button
                onClick={onAddTechClick}
                className={`group relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 
                hover:bg-[#F2AA4C] hover:text-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                <span className="text-lg leading-none">+</span>
                Add Data
              </button>
            )}
          </nav>


          {/* Mobile Nav - Icons Only */}
          <nav className="flex md:hidden items-center gap-1">
            <Link
              href="/"
              className={`p-2 rounded-lg transition-all duration-300 ${pathname === '/'
                ? 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
            >
              <Home className="w-5 h-5" />
            </Link>
            <Link
              href="/jd-parser"
              className={`p-2 rounded-lg transition-all duration-300 ${pathname === '/jd-parser'
                ? 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
            >
              <Code className="w-5 h-5" />
            </Link>
            <Link
              href="/wall-of-shame"
              className={`p-2 rounded-lg transition-all duration-300 ${pathname === '/wall-of-shame'
                ? 'bg-gradient-to-r from-[#101820] to-[#F2AA4C] text-white'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </Link>
            {onAddTechClick && (
              <button
                onClick={onAddTechClick}
                className={`p-2 rounded-lg transition-all duration-300 ${isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
              >
                <span className="text-xl font-bold leading-none">+</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 ${isDark
              ? 'hover:bg-slate-800 text-slate-300 hover:text-yellow-400 hover:scale-110'
              : 'hover:bg-slate-100 text-slate-700 hover:text-indigo-600 hover:scale-110'
              }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Bookmarks button */}
          {onBookmarksClick && (
            <button
              onClick={onBookmarksClick}
              className={`p-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-amber-400 hover:scale-105'
                : 'text-slate-700 hover:bg-slate-100 hover:text-amber-600 hover:scale-105'
                }`}
            >
              <Bookmark className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline text-sm font-bold flex items-center gap-1.5">
                Bookmarks
                {bookmarkCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isDark
                    ? 'bg-amber-400/20 text-amber-400'
                    : 'bg-amber-600/20 text-amber-600'
                    }`}>
                    {bookmarkCount}
                  </span>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}