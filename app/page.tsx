"use client"

import { useState, useEffect, useMemo } from "react"
import { SearchBar } from "@/components/search-bar"
import { TechCard } from "@/components/tech-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookmarksDialog } from "@/components/bookmarks-dialog"

export type Technology = {
  name: string
  release_year: number
  link: string
}

export default function HomePage() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showBookmarks, setShowBookmarks] = useState(false)

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("releasecheck-bookmarks")
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("releasecheck-bookmarks", JSON.stringify(Array.from(bookmarks)))
  }, [bookmarks])

  // Fetch data from GitHub
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main"

        const [techRes, frameworkRes, aiRes, cloudRes] = await Promise.all([
          fetch(`${baseUrl}/tech.json`).catch(() => null),
          fetch(`${baseUrl}/framework.json`).catch(() => null),
          fetch(`${baseUrl}/ai-tools.json`).catch(() => null),
          fetch(`${baseUrl}/cloud.json`).catch(() => null),
        ])

        const allData: Technology[] = []

        if (techRes?.ok) {
          const data = await techRes.json()
          allData.push(...(Array.isArray(data) ? data : []))
        }
        if (frameworkRes?.ok) {
          const data = await frameworkRes.json()
          allData.push(...(Array.isArray(data) ? data : []))
        }
        if (aiRes?.ok) {
          const data = await aiRes.json()
          allData.push(...(Array.isArray(data) ? data : []))
        }
        if (cloudRes?.ok) {
          const data = await cloudRes.json()
          allData.push(...(Array.isArray(data) ? data : []))
        }

        if (allData.length === 0) {
          allData.push(
            { name: "React", release_year: 2013, link: "https://react.dev" },
            { name: "Next.js", release_year: 2016, link: "https://nextjs.org" },
            { name: "TypeScript", release_year: 2012, link: "https://www.typescriptlang.org" },
            { name: "Node.js", release_year: 2009, link: "https://nodejs.org" },
            { name: "Vue.js", release_year: 2014, link: "https://vuejs.org" },
            { name: "Angular", release_year: 2010, link: "https://angular.io" },
            { name: "Python", release_year: 1991, link: "https://www.python.org" },
            { name: "Docker", release_year: 2013, link: "https://www.docker.com" },
            { name: "Kubernetes", release_year: 2014, link: "https://kubernetes.io" },
            { name: "GraphQL", release_year: 2015, link: "https://graphql.org" },
          )
        }

        setTechnologies(allData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) return technologies

    const query = searchQuery.toLowerCase()
    return technologies.filter((tech) => tech.name.toLowerCase().includes(query))
  }, [technologies, searchQuery])

  const toggleBookmark = (name: string) => {
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(name)) {
        newBookmarks.delete(name)
      } else {
        newBookmarks.add(name)
      }
      return newBookmarks
    })
  }

  const bookmarkedTechnologies = technologies.filter((tech) => bookmarks.has(tech.name))

  return (
    <div className="min-h-screen flex flex-col">
      <Header onBookmarksClick={() => setShowBookmarks(true)} />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center max-w-5xl">
        <div className="w-full space-y-8">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Release Check
            </h1>
            <p className="text-muted-foreground text-lg">
              Fact-check job descriptions with realistic experience requirements
            </p>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading technologies...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTechnologies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No technologies found matching "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {filteredTechnologies.length} {filteredTechnologies.length === 1 ? "result" : "results"}
                  </p>
                  <div className="grid gap-4">
                    {filteredTechnologies.map((tech) => (
                      <TechCard
                        key={tech.name}
                        technology={tech}
                        isBookmarked={bookmarks.has(tech.name)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <BookmarksDialog
        open={showBookmarks}
        onOpenChange={setShowBookmarks}
        bookmarkedTechnologies={bookmarkedTechnologies}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  )
}
