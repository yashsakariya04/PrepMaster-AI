import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Info, Clock, TrendingUp } from 'lucide-react'
import type { InterviewRecord } from '../types'
import { readHistory } from '../utils/storage'

const History = () => {
  const [history, setHistory] = useState<InterviewRecord[]>([])
  const [selected, setSelected] = useState<InterviewRecord | null>(null)

  useEffect(() => {
    const data = readHistory()
    setHistory(data)
    setSelected(data[0] ?? null)
  }, [])

  const getTimeTaken = (index: number) => {
    // Simulate time taken: 10-15 minutes per interview
    return Math.floor(Math.random() * 6) + 10
  }

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Interview history
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track your improvements over time</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Each session is stored locally so you can review whenever you like.
        </p>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3 glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg lg:col-span-2"
        >
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
              <CalendarClock className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p>No interviews yet. Complete one to build your timeline.</p>
            </div>
          ) : (
            history.map((record, index) => {
              const isActive = selected?.id === record.id
              const date = new Date(record.date)
              const formattedDate = date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
              const timeTaken = getTimeTaken(index)
              return (
                <motion.button
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelected(record)}
                  className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-blue-50/40 dark:hover:bg-blue-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {record.type}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          {timeTaken} min
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{formattedDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <TrendingUp className="h-3 w-3" />
                        Score
                      </div>
                      <p className="text-3xl font-bold text-primary">{record.score}%</p>
                    </div>
                  </div>
                </motion.button>
              )
            })
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
        >
          {selected ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Session details
                </p>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold gradient-text">{selected.score}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(selected.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  Time taken: {getTimeTaken(history.findIndex((r) => r.id === selected.id))} minutes
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Feedback:</p>
                <ul className="space-y-3">
                  {selected.feedback.map((item, idx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Info className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>Select a session to view feedback.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default History


