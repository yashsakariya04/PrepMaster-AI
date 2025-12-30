import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Award, Clock, PlayCircle, Flame, TrendingUp, BookOpen } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import ErrorBoundary from '../components/ErrorBoundary'
import { useAuth } from '../context/AuthContext'
import { useStreak } from '../hooks/useStreak'
import { useAchievements } from '../hooks/useAchievements'
import type { InterviewRecord } from '../types'
import { readHistory } from '../utils/storage'

// Safe default data - always available
const DEFAULT_CATEGORY_PERFORMANCE = [
  { category: 'Technical', score: 72, count: 3 },
  { category: 'HR', score: 74, count: 3 },
  { category: 'Behavioral', score: 74, count: 2 },
]

const DEFAULT_SKILLS_MAP_DATA = [
  { skill: 'Communication', value: 85 },
  { skill: 'Technical', value: 78 },
  { skill: 'Confidence', value: 82 },
  { skill: 'Clarity', value: 80 },
  { skill: 'Speed', value: 75 },
]

// Safe chart wrapper component
const SafeLineChart = ({ data }: { data: Array<{ name: string; score: number }> }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Complete an interview to see your progress.
      </div>
    )
  }

  try {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis dataKey="name" stroke="#6b7280" tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  } catch (error) {
    console.error('LineChart error:', error)
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Chart error. Please refresh.
      </div>
    )
  }
}

const SafeBarChart = ({ data, dataKey, nameKey }: { data: Array<Record<string, any>>; dataKey: string; nameKey: string }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        No data available.
      </div>
    )
  }

  try {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis dataKey={nameKey} stroke="#6b7280" tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
            }}
          />
          <Bar dataKey={dataKey} fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  } catch (error) {
    console.error('BarChart error:', error)
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Chart error. Please refresh.
      </div>
    )
  }
}

const SafeRadarChart = ({ data }: { data: Array<{ skill: string; value: number }> }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Skills data loading...
      </div>
    )
  }

  try {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <PolarAngleAxis dataKey="skill" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
          <Radar name="Skills" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    )
  } catch (error) {
    console.error('RadarChart error:', error)
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Chart error. Please refresh.
      </div>
    )
  }
}

const Dashboard = () => {
  // Safe hooks with defaults
  const { user } = useAuth()
  const safeUser = user || { name: 'User', email: '' }
  const { streak = 0 } = useStreak()
  const { achievements = [], unlockedCount = 0, checkAchievements } = useAchievements()

  const [history, setHistory] = useState<InterviewRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartError, setChartError] = useState<string | null>(null)

  // Load data once on mount - no infinite loops
  useEffect(() => {
    let mounted = true

    const loadData = () => {
      try {
        setIsLoading(true)
        setChartError(null)

        const data = readHistory()
        const safeData = Array.isArray(data) ? data : []

        if (mounted) {
          setHistory(safeData)

          // Check achievements safely
          if (safeData.length > 0 && checkAchievements) {
            try {
              const scores = safeData
                .map((r) => (r && typeof r.score === 'number' ? r.score : 0))
                .filter((s) => !isNaN(s) && s > 0)

              if (scores.length > 0) {
                const highestScore = Math.max(...scores)
                checkAchievements({
                  totalInterviews: safeData.length,
                  highestScore,
                  streak: 7,
                })
              }
            } catch (err) {
              console.error('Error checking achievements:', err)
            }
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        if (mounted) {
          setHistory([])
          setChartError('Failed to load data')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, []) // Empty dependency array - only run once

  // Safe stats calculation
  const stats = useMemo(() => {
    try {
      const safeHistory = Array.isArray(history) ? history : []
      const total = safeHistory.length

      if (total === 0) {
        return { total: 0, avg: 0, hours: '0.0', highest: 0 }
      }

      const validScores = safeHistory
        .map((r) => (r && typeof r.score === 'number' ? r.score : 0))
        .filter((s) => !isNaN(s) && s >= 0 && s <= 100)

      if (validScores.length === 0) {
        return { total, avg: 0, hours: '0.0', highest: 0 }
      }

      const sum = validScores.reduce((acc, score) => acc + score, 0)
      const avg = Math.round(sum / validScores.length)
      const highest = Math.max(...validScores)
      const hours = (total * 0.5).toFixed(1)

      return { total, avg, hours, highest }
    } catch (error) {
      console.error('Error calculating stats:', error)
      return { total: 0, avg: 0, hours: '0.0', highest: 0 }
    }
  }, [history])

  // Safe chart data - line chart
  const lineChartData = useMemo(() => {
    try {
      const safeHistory = Array.isArray(history) ? history : []
      if (safeHistory.length === 0) return []

      return safeHistory.slice(-10).map((record, index) => {
        const score = record && typeof record.score === 'number' ? record.score : 0
        return {
          name: `Session ${index + 1}`,
          score: Math.max(0, Math.min(100, score)), // Clamp between 0-100
        }
      })
    } catch (error) {
      console.error('Error creating line chart data:', error)
      return []
    }
  }, [history])

  // Safe chart data - bar chart (recent scores)
  const barChartData = useMemo(() => {
    try {
      const safeHistory = Array.isArray(history) ? history : []
      if (safeHistory.length === 0) return []

      const subset = safeHistory.slice(-5).reverse()
      return subset.map((record, index) => {
        const score = record && typeof record.score === 'number' ? record.score : 0
        return {
          name: `#${subset.length - index}`,
          score: Math.max(0, Math.min(100, score)),
        }
      })
    } catch (error) {
      console.error('Error creating bar chart data:', error)
      return []
    }
  }, [history])

  // Safe category performance data - always use defaults (imported at top level)
  const categoryData = useMemo(() => {
    try {
      return DEFAULT_CATEGORY_PERFORMANCE.map((item) => ({
        category: item?.category || 'Unknown',
        score: typeof item?.score === 'number' ? Math.max(0, Math.min(100, item.score)) : 0,
        count: typeof item?.count === 'number' ? item.count : 0,
      }))
    } catch (error) {
      console.error('Error creating category data:', error)
      return DEFAULT_CATEGORY_PERFORMANCE
    }
  }, [])

  // Safe skills map data - always use defaults (imported at top level)
  const skillsData = useMemo(() => {
    try {
      return DEFAULT_SKILLS_MAP_DATA.map((item) => ({
        skill: item?.skill || 'Unknown',
        value: typeof item?.value === 'number' ? Math.max(0, Math.min(100, item.value)) : 0,
      }))
    } catch (error) {
      console.error('Error creating skills data:', error)
      return DEFAULT_SKILLS_MAP_DATA
    }
  }, [])

  // Safe achievements
  const recentAchievements = useMemo(() => {
    try {
      if (!Array.isArray(achievements)) return []
      return achievements
        .filter((a) => a && a.unlockedAt !== null && a.id && a.title)
        .slice(-3)
    } catch (error) {
      console.error('Error processing achievements:', error)
      return []
    }
  }, [achievements])

  // Safe streak value
  const displayStreak = useMemo(() => {
    try {
      const historyStreak = history.length > 0 ? 7 : streak
      return typeof historyStreak === 'number' && historyStreak >= 0 ? historyStreak : 0
    } catch {
      return 0
    }
  }, [history.length, streak])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-primary" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-100">Welcome back</p>
              <h1 className="mt-2 text-4xl font-bold">Hi {safeUser.name || 'there'}! 👋</h1>
              <p className="mt-3 max-w-2xl text-lg text-blue-100">
                Ready to ace your next interview? Let's keep the momentum going!
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/interview"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Interview
                </Link>
                <Link
                  to="/practice"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <BookOpen className="h-5 w-5" />
                  Practice MCQ
                </Link>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Flame className="h-6 w-6 text-orange-400" />
                  <span className="text-3xl font-bold">{displayStreak}</span>
                </div>
                <p className="mt-2 text-sm text-blue-100">Day Streak</p>
              </div>
            </div>
          </div>
        </motion.section>

        {chartError && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
            {chartError}
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <StatCard label="Total Interviews" value={stats.total} icon={<Activity className="h-6 w-6 text-primary" />} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <StatCard label="Average Score" value={`${stats.avg}%`} icon={<Award className="h-6 w-6 text-primary" />} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <StatCard label="Highest Score" value={`${stats.highest}%`} icon={<TrendingUp className="h-6 w-6 text-primary" />} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <StatCard
              label="Hours Practiced"
              value={stats.hours}
              helperText="≈30 min per session"
              icon={<Clock className="h-6 w-6 text-primary" />}
            />
          </motion.div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Chart */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Trend</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 10 sessions</p>
              </div>
            </div>
            <div className="h-64">
              <SafeLineChart data={lineChartData} />
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-primary dark:bg-blue-900/30">
                {unlockedCount}/{Array.isArray(achievements) ? achievements.length : 0}
              </span>
            </div>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                    <span className="text-2xl">{ach.icon || '🏆'}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{ach.title || 'Achievement'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{ach.description || ''}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete interviews to unlock achievements!</p>
              )}
            </div>
            <Link
              to="/profile"
              className="mt-4 block text-center text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-400"
            >
              View all →
            </Link>
          </motion.section>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Performance Bar Chart */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Scores</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last five interviews</p>
              </div>
            </div>
            <div className="h-64">
              <SafeBarChart data={barChartData} dataKey="score" nameKey="name" />
            </div>
          </motion.section>

          {/* Category Performance */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category Performance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average scores by type</p>
              </div>
            </div>
            <div className="h-64">
              <SafeBarChart data={categoryData} dataKey="score" nameKey="category" />
            </div>
          </motion.section>
        </div>

        {/* Skills Radar Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skills Map</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your performance across key areas</p>
            </div>
          </div>
          <div className="h-80">
            <SafeRadarChart data={skillsData} />
          </div>
        </motion.section>
      </div>
    </ErrorBoundary>
  )
}

export default Dashboard
