export type InterviewType = 'Technical' | 'HR' | 'Behavioral'

export type User = {
  name: string
  email: string
  skills?: string[]
  goals?: string
  profilePicture?: string
}

export type InterviewRecord = {
  id: string
  type: InterviewType
  date: string
  score: number
  feedback: string[]
}

export type ResourceCategory =
  | 'Technical'
  | 'Behavioral'
  | 'HR'
  | 'General'

export type ResourceItem = {
  id: number
  title: string
  category: ResourceCategory
  description: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  thumbnail?: string
  url?: string
}

// AI-related types
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type AIInterviewQuestion = {
  id: string
  question: string
  hint: string
  type: InterviewType
  difficulty: Difficulty
  estimatedTime: number // in seconds
}

export type AnswerEvaluation = {
  score: number // 0-100
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  feedback: string
  improvementAreas: string[]
}

export type LearningTopic = {
  id: string
  name: string
  priority: 'High' | 'Medium' | 'Low'
  description: string
  estimatedHours: number
  completed: boolean
}

export type LearningPath = {
  topics: LearningTopic[]
  goals: string[]
  estimatedTimeToImprovement: string
  recommendations: string
}

export type MCQQuestion = {
  id: string
  question: string
  options: string[]
  correct: number // index of correct option
  explanation: string
  topic: string
  difficulty: Difficulty
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type AIApiResponse<T> = {
  success: boolean
  message?: string
  [key: string]: any
}


