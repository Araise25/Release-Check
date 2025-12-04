"use client"

import { useState, useEffect } from 'react'

const BOOKMARKS_KEY = 'release-check-bookmarks'

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load bookmarks from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(BOOKMARKS_KEY)
            if (stored) {
                const bookmarkArray = JSON.parse(stored) as string[]
                setBookmarks(new Set(bookmarkArray))
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save bookmarks to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                const bookmarkArray = Array.from(bookmarks)
                localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkArray))
            } catch (error) {
                console.error('Error saving bookmarks:', error)
            }
        }
    }, [bookmarks, isLoaded])

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

    const clearBookmarks = () => {
        setBookmarks(new Set())
    }

    return {
        bookmarks,
        toggleBookmark,
        clearBookmarks,
        isLoaded
    }
}
