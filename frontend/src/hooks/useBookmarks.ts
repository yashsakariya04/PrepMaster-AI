import { useEffect, useState } from 'react'

const BOOKMARKS_KEY = 'prepmaster_bookmarks'

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((b) => b !== id)
      }
      return [...prev, id]
    })
  }

  const isBookmarked = (id: number) => bookmarks.includes(id)

  return { bookmarks, toggleBookmark, isBookmarked }
}


