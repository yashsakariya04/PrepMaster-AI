import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generatePersonalizedLearningPath,
  generateMCQQuestions,
  chatWithAIBuddy
} from './services/geminiService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const dataDir = join(__dirname, 'data')

// Ensure data directory exists
import { mkdirSync } from 'fs'
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Helper function to read JSON files
const readJSON = (filename) => {
  const filePath = join(dataDir, filename)
  if (!existsSync(filePath)) {
    return []
  }
  try {
    const data = readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

// Helper function to write JSON files
const writeJSON = (filename, data) => {
  const filePath = join(dataDir, filename)
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

// Routes
app.get('/api/interview-questions', (req, res) => {
  const questions = readJSON('interview.json')
  res.json(questions)
})

app.get('/api/practice-questions', (req, res) => {
  const questions = readJSON('questions.json')
  res.json(questions)
})

app.get('/api/resources', (req, res) => {
  const resources = readJSON('resources.json')
  res.json(resources)
})

app.get('/api/user', (req, res) => {
  const users = readJSON('user.json')
  const user = users[0] || null
  res.json(user)
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const users = readJSON('user.json')
  const user = users.find((u) => u.email === email)
  
  if (user && password.length >= 6) {
    res.json({ success: true, user })
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
})

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body
  const users = readJSON('user.json')
  
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
  }
  
  const newUser = { name, email, skills: [], goals: '' }
  users.push(newUser)
  writeJSON('user.json', users)
  
  res.json({ success: true, user: newUser })
})

// ==========================================
// AI-POWERED ENDPOINTS
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiApiConfigured: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    apiKeyPreview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Generate AI interview questions
app.post('/api/ai/interview-questions', async (req, res) => {
  try {
    console.log('=== API ENDPOINT CALLED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { type, difficulty, count, userProfile } = req.body

    // Validate input
    if (!type) {
      console.error('Missing interview type');
      return res.status(400).json({
        success: false,
        message: 'Interview type is required',
        details: 'Please select Technical, HR, or Behavioral'
      })
    }
    
    if (!['Technical', 'HR', 'Behavioral'].includes(type)) {
      console.error('Invalid interview type:', type);
      return res.status(400).json({
        success: false,
        message: 'Invalid interview type',
        details: `Must be one of: Technical, HR, or Behavioral. Received: ${type}`
      })
    }
    
    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty level is required',
        details: 'Please select Easy, Medium, or Hard'
      })
    }
    
    if (!count || count < 1) {
      return res.status(400).json({
        success: false,
        message: 'Count must be at least 1',
        details: `Received count: ${count}`
      })
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY.trim() === '') {
      console.warn('GEMINI_API_KEY not configured. Using fallback data.')
      const staticQuestions = readJSON('interview.json')
      const filtered = staticQuestions
        .filter(q => q.type === type)
        .slice(0, count)
      return res.json({ success: true, questions: filtered, fallback: true, message: 'Using static data. Configure GEMINI_API_KEY for AI-generated questions.' })
    }

    // Fallback to static data if AI fails
    try {
      console.log('Calling geminiService.generateInterviewQuestions...');
      const questions = await generateInterviewQuestions(
        type,
        difficulty,
        count,
        userProfile || {}
      )
      
      console.log('Questions generated successfully:', questions?.length || 0);
      
      if (!questions || questions.length === 0) {
        throw new Error('No questions generated - returned empty array')
      }
      
      console.log('=== API ENDPOINT SUCCESS ===');
      res.json({ success: true, questions })
    } catch (aiError) {
      console.error('=== API ENDPOINT ERROR - AI GENERATION FAILED ===');
      console.error('Error details:', {
        name: aiError?.name,
        message: aiError?.message,
        stack: aiError?.stack
      });
      
      // Fallback to static data
      try {
        const staticQuestions = readJSON('interview.json')
        const filtered = staticQuestions
          .filter(q => q.type === type)
          .slice(0, count)
        console.log('Using fallback data:', filtered.length, 'questions');
        res.json({ 
          success: true, 
          questions: filtered, 
          fallback: true,
          message: 'AI generation failed. Using static questions. ' + (aiError.message || ''),
          error: aiError.message
        })
      } catch (fallbackError) {
        console.error('Fallback data also failed:', fallbackError);
        res.status(500).json({
          success: false,
          message: 'Failed to generate questions and fallback data unavailable',
          details: aiError.message,
          type: aiError.name
        })
      }
    }
  } catch (error) {
    console.error('=== API ENDPOINT ERROR - OUTER CATCH ===');
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions',
      details: error.message,
      type: error.name,
      suggestion: 'Check backend console for detailed logs'
    })
  }
})

// Evaluate user's answer
app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, context } = req.body

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: question and answer are required'
      })
    }

    const evaluation = await evaluateAnswer(question, answer, context || {})
    res.json({ success: true, evaluation })
  } catch (error) {
    console.error('Error in /api/ai/evaluate-answer:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to evaluate answer'
    })
  }
})

// Generate personalized learning path
app.post('/api/ai/learning-path', async (req, res) => {
  try {
    const { userStats, weaknesses } = req.body

    const learningPath = await generatePersonalizedLearningPath(
      userStats || {},
      weaknesses || []
    )
    res.json({ success: true, learningPath })
  } catch (error) {
    console.error('Error in /api/ai/learning-path:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate learning path'
    })
  }
})

// Generate MCQ questions
app.post('/api/ai/mcq-questions', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body

    if (!topic || !difficulty || !count) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: topic, difficulty, and count are required'
      })
    }

    // Fallback to static data if AI fails
    try {
      const questions = await generateMCQQuestions(topic, difficulty, count)
      res.json({ success: true, questions })
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError)
      // Fallback to static data
      const staticQuestions = readJSON('questions.json')
      const filtered = staticQuestions
        .filter(q => q.difficulty === difficulty)
        .slice(0, count)
      res.json({ success: true, questions: filtered, fallback: true })
    }
  } catch (error) {
    console.error('Error in /api/ai/mcq-questions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate MCQ questions'
    })
  }
})

// AI chat buddy
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { userMessage, conversationHistory } = req.body

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: userMessage'
      })
    }

    const aiResponse = await chatWithAIBuddy(
      userMessage,
      conversationHistory || []
    )
    res.json({ success: true, response: aiResponse })
  } catch (error) {
    console.error('Error in /api/ai/chat:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI response'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`AI endpoints available at http://localhost:${PORT}/api/ai/*`)
})

