import type { InterviewRecord } from '../types'
import { sampleInterviewHistory } from '../data/sampleData'

const HISTORY_KEY = 'prepai_history'
const INITIALIZED_KEY = 'prepai_initialized'

const canUseStorage = () => typeof window !== 'undefined'

export const readHistory = (): InterviewRecord[] => {
  if (!canUseStorage()) return []
  
  try {
    const data = window.localStorage.getItem(HISTORY_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && typeof item === 'object' && typeof item.score === 'number')
      }
    }
  } catch (error) {
    console.error('Error parsing history from localStorage:', error)
    // Clear corrupted data
    try {
      window.localStorage.removeItem(HISTORY_KEY)
    } catch {
      // Ignore
    }
  }
  
  // Initialize with sample data if first time
  try {
    const initialized = localStorage.getItem(INITIALIZED_KEY)
    if (!initialized) {
      saveHistory(sampleInterviewHistory)
      localStorage.setItem(INITIALIZED_KEY, 'true')
      return sampleInterviewHistory
    }
  } catch (error) {
    console.error('Error initializing sample data:', error)
  }
  
  return []
}

export const saveHistory = (records: InterviewRecord[]) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(records))
}

export const appendHistory = (record: InterviewRecord) => {
  const current = readHistory()
  const updated = [record, ...current]
  saveHistory(updated)
  return updated
}


