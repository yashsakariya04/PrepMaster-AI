import { useEffect, useState } from 'react'

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
}

const ACHIEVEMENTS_KEY = 'prepmaster_achievements'

const allAchievements: Achievement[] = [
  {
    id: 'first-interview',
    title: 'First Steps',
    description: 'Completed your first interview',
    icon: '🎯',
    unlockedAt: null,
  },
  {
    id: 'score-80',
    title: 'High Performer',
    description: 'Scored 80% or higher in a practice test',
    icon: '⭐',
    unlockedAt: null,
  },
  {
    id: 'score-90',
    title: 'Expert Level',
    description: 'Scored 90% or higher in a practice test',
    icon: '🏆',
    unlockedAt: null,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    unlockedAt: null,
  },
  {
    id: 'streak-30',
    title: 'Month Master',
    description: 'Maintained a 30-day streak',
    icon: '💪',
    unlockedAt: null,
  },
  {
    id: 'interviews-10',
    title: 'Dedicated',
    description: 'Completed 10 interviews',
    icon: '📚',
    unlockedAt: null,
  },
]

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    if (stored) {
      return JSON.parse(stored) as Achievement[]
    }
    return allAchievements
  })

  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
  }, [achievements])

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date().toISOString() }
        }
        return ach
      })
    )
  }

  const checkAchievements = (stats: {
    totalInterviews: number
    highestScore: number
    streak: number
  }) => {
    // Check first interview
    if (stats.totalInterviews >= 1) {
      unlockAchievement('first-interview')
    }

    // Check score achievements
    if (stats.highestScore >= 90) {
      unlockAchievement('score-90')
    } else if (stats.highestScore >= 80) {
      unlockAchievement('score-80')
    }

    // Check streak achievements
    if (stats.streak >= 30) {
      unlockAchievement('streak-30')
    } else if (stats.streak >= 7) {
      unlockAchievement('streak-7')
    }

    // Check interview count
    if (stats.totalInterviews >= 10) {
      unlockAchievement('interviews-10')
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length

  return {
    achievements,
    unlockAchievement,
    checkAchievements,
    unlockedCount,
    totalCount: achievements.length,
  }
}


