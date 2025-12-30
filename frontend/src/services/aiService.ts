import axios from 'axios'
import type {
  AIInterviewQuestion,
  AnswerEvaluation,
  LearningPath,
  MCQQuestion,
  InterviewType,
  Difficulty,
  ChatMessage,
  User,
  AIApiResponse
} from '../types'

// Base API URL
const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI requests
})

// Test backend connection
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await axios.get('http://localhost:3001/api/interview-questions', {
      timeout: 5000,
    })
    return response.status === 200
  } catch (error) {
    console.error('Backend connection test failed:', error)
    return false
  }
}

/**
 * Generate AI-powered interview questions
 */
export async function generateInterviewQuestions(
  type: InterviewType,
  difficulty: Difficulty,
  count: number,
  userProfile?: Partial<User>
): Promise<AIInterviewQuestion[]> {
  try {
    const response = await apiClient.post<AIApiResponse<{ questions: AIInterviewQuestion[] }>>(
      '/ai/interview-questions',
      {
        type,
        difficulty,
        count,
        userProfile: userProfile || {},
      }
    )

    if (response.data.success && response.data.questions) {
      return response.data.questions
    }

    throw new Error(response.data.message || 'Failed to generate questions')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Network error. Please check your connection.'
      )
    }
    throw error
  }
}

/**
 * Evaluate user's answer using AI
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  context?: {
    type?: InterviewType
    difficulty?: Difficulty
  }
): Promise<AnswerEvaluation> {
  try {
    const response = await apiClient.post<AIApiResponse<{ evaluation: AnswerEvaluation }>>(
      '/ai/evaluate-answer',
      {
        question,
        answer,
        context: context || {},
      }
    )

    if (response.data.success && response.data.evaluation) {
      return response.data.evaluation
    }

    throw new Error(response.data.message || 'Failed to evaluate answer')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Network error. Please check your connection.'
      )
    }
    throw error
  }
}

/**
 * Generate personalized learning path
 */
export async function generateLearningPath(
  userStats?: {
    skills?: string[]
    averageScore?: number
    goals?: string
  },
  weaknesses?: string[]
): Promise<LearningPath> {
  try {
    const response = await apiClient.post<AIApiResponse<{ learningPath: LearningPath }>>(
      '/ai/learning-path',
      {
        userStats: userStats || {},
        weaknesses: weaknesses || [],
      }
    )

    if (response.data.success && response.data.learningPath) {
      return response.data.learningPath
    }

    throw new Error(response.data.message || 'Failed to generate learning path')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Network error. Please check your connection.'
      )
    }
    throw error
  }
}

/**
 * Generate MCQ questions using AI
 */
export async function generateMCQQuestions(
  topic: string,
  difficulty: Difficulty,
  count: number
): Promise<MCQQuestion[]> {
  try {
    const response = await apiClient.post<AIApiResponse<{ questions: MCQQuestion[] }>>(
      '/ai/mcq-questions',
      {
        topic,
        difficulty,
        count,
      }
    )

    if (response.data.success && response.data.questions) {
      return response.data.questions
    }

    throw new Error(response.data.message || 'Failed to generate MCQ questions')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Network error. Please check your connection.'
      )
    }
    throw error
  }
}

/**
 * Chat with AI study buddy
 */
export async function chatWithAI(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Convert ChatMessage[] to format expected by backend
    const history = conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await apiClient.post<AIApiResponse<{ response: string }>>('/ai/chat', {
      userMessage,
      conversationHistory: history,
    })

    if (response.data.success && response.data.response) {
      return response.data.response
    }

    throw new Error(response.data.message || 'Failed to get AI response')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Network error. Please check your connection.'
      )
    }
    throw error
  }
}

