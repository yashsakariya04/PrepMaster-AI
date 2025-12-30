import { useEffect, useState } from 'react'

const STREAK_KEY = 'prepmaster_streak'
const LAST_ACTIVITY_KEY = 'prepmaster_last_activity'

export const useStreak = () => {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const updateStreak = () => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
      const today = new Date().toDateString()
      
      if (!lastActivity) {
        localStorage.setItem(LAST_ACTIVITY_KEY, today)
        localStorage.setItem(STREAK_KEY, '1')
        setStreak(1)
        return
      }

      const lastDate = new Date(lastActivity)
      const todayDate = new Date(today)
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // Same day, keep current streak
        const currentStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10)
        setStreak(currentStreak)
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        const currentStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10)
        const newStreak = currentStreak + 1
        localStorage.setItem(STREAK_KEY, newStreak.toString())
        localStorage.setItem(LAST_ACTIVITY_KEY, today)
        setStreak(newStreak)
      } else {
        // Streak broken, reset to 1
        localStorage.setItem(STREAK_KEY, '1')
        localStorage.setItem(LAST_ACTIVITY_KEY, today)
        setStreak(1)
      }
    }

    updateStreak()
  }, [])

  const incrementStreak = () => {
    const today = new Date().toDateString()
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
    
    if (lastActivity !== today) {
      const currentStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10)
      const lastDate = new Date(lastActivity || '')
      const todayDate = new Date(today)
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        const newStreak = currentStreak + 1
        localStorage.setItem(STREAK_KEY, newStreak.toString())
        localStorage.setItem(LAST_ACTIVITY_KEY, today)
        setStreak(newStreak)
      } else if (daysDiff > 1) {
        localStorage.setItem(STREAK_KEY, '1')
        localStorage.setItem(LAST_ACTIVITY_KEY, today)
        setStreak(1)
      }
    }
  }

  return { streak, incrementStreak }
}


