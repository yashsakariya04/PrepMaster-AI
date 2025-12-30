import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Bookmark, BookmarkCheck } from 'lucide-react'
import { resourceItems } from '../data/mockData'
import { useBookmarks } from '../hooks/useBookmarks'
import type { ResourceCategory } from '../types'

const categories: Array<'All' | ResourceCategory> = ['All', 'Technical', 'Behavioral', 'HR', 'General']

const Resources = () => {
  const [filter, setFilter] = useState<'All' | ResourceCategory>('All')
  const { toggleBookmark, isBookmarked } = useBookmarks()

  const filteredResources = useMemo(() => {
    if (filter === 'All') return resourceItems
    return resourceItems.filter((item) => item.category === filter)
  }, [filter])

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Resource library
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quick hits to stay sharp</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Curated cards organized by interview type. Bookmark your favorites!
        </p>
      </header>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => {
          const isActive = category === filter
          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400'
              }`}
            >
              {category}
            </motion.button>
          )
        })}
      </div>

      {/* Resource Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource, index) => {
          const bookmarked = isBookmarked(resource.id)
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-strong group relative flex h-full flex-col rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover-glow overflow-hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <BookOpen className="h-5 w-5" />
                  {resource.category}
                </div>
                <button
                  onClick={() => toggleBookmark(resource.id)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-700"
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>
              {resource.thumbnail && (
                <div className="mb-4 text-4xl text-center">{resource.thumbnail}</div>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{resource.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {resource.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                {resource.difficulty && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      resource.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : resource.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {resource.difficulty}
                  </span>
                )}
                {resource.url && (
                  <motion.a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-md"
                  >
                    Visit Resource
                    <span>→</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No resources found for this category.</p>
        </div>
      )}
    </div>
  )
}

export default Resources


