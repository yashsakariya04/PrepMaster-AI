import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronRight, ClipboardList, RefreshCw, Target, TrendingUp, Loader2, Lightbulb, AlertCircle, Clock } from 'lucide-react'
import { useStreak } from '../hooks/useStreak'
import { useAchievements } from '../hooks/useAchievements'
import { useAuth } from '../context/AuthContext'
import type { InterviewType, Difficulty, AIInterviewQuestion, AnswerEvaluation } from '../types'
import { appendHistory } from '../utils/storage'
import { generateInterviewQuestions, evaluateAnswer, testBackendConnection } from '../services/aiService'

const questionCount = 5 // Reduced for AI generation speed
const interviewTypes: InterviewType[] = ['Technical', 'HR', 'Behavioral']
const difficultyLevels: Difficulty[] = ['Easy', 'Medium', 'Hard']

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const Interview = () => {
  const { user } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedType, setSelectedType] = useState<InterviewType>('Technical')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<AIInterviewQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [resultScore, setResultScore] = useState<number | null>(null)
  const [overallEvaluation, setOverallEvaluation] = useState<AnswerEvaluation | null>(null)
  const [hasSaved, setHasSaved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const { incrementStreak } = useStreak()
  const { checkAchievements, unlockAchievement } = useAchievements()

  // Timer effect
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && step === 2) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      // Time's up - auto move to next or finish
      handleNext()
    }
  }, [timeRemaining, step])

  const resetInterview = () => {
    setStep(1)
    setCurrentQuestion(0)
    setQuestions([])
    setAnswers([])
    setEvaluations([])
    setError(null)
    setIsLoading(false)
    setIsEvaluating(false)
    setResultScore(null)
    setOverallEvaluation(null)
    setHasSaved(false)
    setShowHint(false)
    setTimeRemaining(null)
  }

  const loadAIQuestions = async () => {
    setIsLoading(true)
    setError(null)
    
    // First, test if backend is reachable
    try {
      const isBackendAvailable = await testBackendConnection()
      if (!isBackendAvailable) {
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:3001. Open a terminal, navigate to the backend folder, and run: npm start')
        setIsLoading(false)
        return
      }
    } catch (testErr) {
      setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:3001')
      setIsLoading(false)
      return
    }
    
    try {
      const aiQuestions = await generateInterviewQuestions(
        selectedType,
        selectedDifficulty,
        questionCount,
        {
          skills: user?.skills || [],
          goals: user?.goals || '',
        }
      )
      
      if (!aiQuestions || aiQuestions.length === 0) {
        throw new Error('No questions were generated. Please try again.')
      }
      
      setQuestions(aiQuestions)
      setAnswers(Array(aiQuestions.length).fill(''))
      setStep(2)
      if (aiQuestions[0]?.estimatedTime) {
        setTimeRemaining(aiQuestions[0].estimatedTime)
      }
    } catch (err) {
      let errorMessage = 'Failed to generate interview questions.'
      
      if (err instanceof Error) {
        const errMsg = err.message.toLowerCase()
        if (errMsg.includes('network') || errMsg.includes('connection') || errMsg.includes('econnrefused') || errMsg.includes('fetch')) {
          errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:3001'
        } else if (errMsg.includes('timeout')) {
          errorMessage = 'Request timed out. The AI service may be slow. Please try again.'
        } else if (errMsg.includes('api key') || errMsg.includes('authentication') || errMsg.includes('gemini')) {
          errorMessage = 'API key error. Please check your Gemini API key in the backend .env file. Get your key from: https://makersuite.google.com/app/apikey'
        } else {
          errorMessage = err.message || 'Unknown error occurred. Please check the browser console (F12) for details.'
        }
      }
      
      setError(errorMessage)
      
      // Enhanced error logging
      console.error('=== FRONTEND ERROR - LOADING QUESTIONS ===');
      console.error('Error object:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: err.cause,
        });
      }
      
      // Check if it's an axios error with response data
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('Axios error response:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
        
        // Update error message with server-provided details
        if (axiosError.response?.data?.details) {
          setError(axiosError.response.data.details);
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => {
      const updated = [...prev]
      updated[currentQuestion] = value
      return updated
    })
  }

  const evaluateCurrentAnswer = async (autoAdvance = false) => {
    if (!answers[currentQuestion]?.trim() || !questions[currentQuestion]) return

    setIsEvaluating(true)
    setError(null)
    try {
      const evaluation = await evaluateAnswer(
        questions[currentQuestion].question,
        answers[currentQuestion],
        {
          type: selectedType,
          difficulty: selectedDifficulty,
        }
      )
      setEvaluations((prev) => {
        const updated = [...prev]
        updated[currentQuestion] = evaluation
        return updated
      })
      
      // Auto-advance after a brief delay if requested
      if (autoAdvance) {
        setTimeout(() => {
          proceedToNext()
        }, 2000) // 2 second delay to show evaluation
      }
    } catch (err) {
      console.error('Error evaluating answer:', err)
      // Continue anyway with a basic evaluation
      setEvaluations((prev) => {
        const updated = [...prev]
        updated[currentQuestion] = {
          score: 70,
          strengths: ['Answer provided'],
          weaknesses: ['Could not evaluate'],
          suggestions: ['Please check your internet connection'],
          feedback: 'Evaluation unavailable',
          improvementAreas: [],
        }
        return updated
      })
      if (autoAdvance) {
        setTimeout(() => {
          proceedToNext()
        }, 1000)
      }
    } finally {
      setIsEvaluating(false)
    }
  }

  const proceedToNext = () => {
    setError(null)
    setShowHint(false)

    if (currentQuestion === questions.length - 1) {
      // Calculate overall score and evaluation
      const avgScore = Math.round(
        evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length
      )
      setResultScore(avgScore)
      
      // Create overall evaluation summary
      const allStrengths = evaluations.flatMap((evaluation) => evaluation.strengths)
      const allWeaknesses = evaluations.flatMap((evaluation) => evaluation.weaknesses)
      const allSuggestions = evaluations.flatMap((evaluation) => evaluation.suggestions)
      
      setOverallEvaluation({
        score: avgScore,
        strengths: [...new Set(allStrengths)].slice(0, 5),
        weaknesses: [...new Set(allWeaknesses)].slice(0, 5),
        suggestions: [...new Set(allSuggestions)].slice(0, 5),
        feedback: `You scored ${avgScore}% overall. ${avgScore >= 80 ? 'Great job!' : avgScore >= 60 ? 'Good effort!' : 'Keep practicing!'}`,
        improvementAreas: [...new Set(evaluations.flatMap((evaluation) => evaluation.improvementAreas))].slice(0, 5),
      })
      
      persistResult(avgScore, evaluations)
      setStep(3)
      return
    }

    setCurrentQuestion((prev) => {
      const next = prev + 1
      if (questions[next]?.estimatedTime) {
        setTimeRemaining(questions[next].estimatedTime)
      }
      return next
    })
  }

  const handleNext = async () => {
    if (!answers[currentQuestion]?.trim()) {
      setError('Please enter your response before moving on.')
      return
    }

    // Evaluate current answer before moving if not already evaluated
    if (!evaluations[currentQuestion]) {
      await evaluateCurrentAnswer(true) // Auto-advance after evaluation
      return
    }

    // If already evaluated, proceed immediately
    proceedToNext()
  }

  const persistResult = (score: number, evaluations: AnswerEvaluation[]) => {
    const feedback = evaluations.map((evaluation, idx) => 
      `Q${idx + 1}: ${evaluation.score}% - ${evaluation.feedback}`
    )
    const record = {
      id: generateId(),
      type: selectedType,
      date: new Date().toISOString(),
      score,
      feedback,
    }
    appendHistory(record)
    setHasSaved(true)
    incrementStreak()
    checkAchievements({
      totalInterviews: 1,
      highestScore: score,
      streak: 0,
    })
    if (score >= 80) unlockAchievement('score-80')
    if (score >= 90) unlockAchievement('score-90')
  }

  const handleSave = () => {
    if (hasSaved || resultScore === null) return
    if (overallEvaluation) {
      persistResult(resultScore, evaluations)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          AI-Powered Mock Interview
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sharpen your answers with AI</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized questions and detailed AI-powered feedback.
        </p>
      </motion.header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Step 1 · Configure your interview</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Select type and difficulty level.</p>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Interview Type
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                {interviewTypes.map((type, index) => {
                  const isActive = selectedType === type
                  return (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-xl border-2 p-5 text-left transition ${
                        isActive
                          ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-blue-50/40 dark:hover:bg-blue-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5" />
                        <p className="text-lg font-bold">{type}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type === 'Technical' && 'Problem-solving and coding questions'}
                        {type === 'HR' && 'Culture and process conversations'}
                        {type === 'Behavioral' && 'STAR method storytelling'}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Difficulty Level
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                {difficultyLevels.map((difficulty, index) => {
                  const isActive = selectedDifficulty === difficulty
                  return (
                    <motion.button
                      key={difficulty}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (interviewTypes.length + index) * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`rounded-xl border-2 p-4 text-center transition ${
                        isActive
                          ? 'border-primary bg-blue-50 dark:bg-blue-900/20 text-primary shadow-lg font-semibold'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-blue-50/40 dark:hover:bg-blue-900/10'
                      }`}
                    >
                      {difficulty}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadAIQuestions}
                disabled={isLoading}
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    Start AI Interview
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetInterview}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </motion.button>
            </div>
          </motion.section>
        )}

        {step === 2 && questions.length > 0 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {selectedType} interview · {selectedDifficulty}
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {timeRemaining !== null && (
                  <span className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-primary dark:bg-blue-900/30">
                    <Clock className="h-4 w-4" />
                    {formatTime(timeRemaining)}
                  </span>
                )}
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-primary dark:bg-blue-900/30">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% done
                </span>
              </div>
            </div>
            <div className="mb-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full gradient-primary"
              />
            </div>
            
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {questions[currentQuestion]?.question}
              </p>
              {questions[currentQuestion]?.hint && (
                <motion.button
                  onClick={() => setShowHint(!showHint)}
                  className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHint ? 'Hide' : 'Show'} Hint
                </motion.button>
              )}
              <AnimatePresence>
                {showHint && questions[currentQuestion]?.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <strong>Hint:</strong> {questions[currentQuestion].hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Show evaluation if available */}
            <AnimatePresence>
              {evaluations[currentQuestion] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Score: {evaluations[currentQuestion].score}%
                    </span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {evaluations[currentQuestion].feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={isEvaluating}
              className="min-h-[200px] w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 disabled:opacity-60"
              placeholder="Write your answer here..."
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={isEvaluating || !answers[currentQuestion]?.trim()}
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {evaluations[currentQuestion] ? 'Moving to next...' : 'Evaluating with AI...'}
                  </>
                ) : evaluations[currentQuestion] ? (
                  currentQuestion === questions.length - 1 ? (
                    <>
                      Finish Interview
                      <CheckCircle className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Next Question
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )
                ) : (
                  <>
                    Evaluate & Continue
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.section>
        )}

        {step === 3 && overallEvaluation && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle className="h-10 w-10 text-green-500" />
              </motion.div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Step 3 · AI-Powered Results
                </p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Great job! Here's your detailed evaluation.</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-8 py-8 text-center"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Score</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-6xl font-bold gradient-text mt-2"
                >
                  {resultScore ?? '--'}%
                </motion.p>
                <div className="mt-4 h-3 w-full max-w-xs mx-auto rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resultScore ?? 0}%` }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="h-full gradient-primary"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {overallEvaluation.feedback}
                </p>
              </motion.div>
              <div className="space-y-4">
                {overallEvaluation.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">✨ Strengths</p>
                    <ul className="space-y-2">
                      {overallEvaluation.strengths.map((strength, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="flex items-start gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 p-3"
                        >
                          <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
                {overallEvaluation.weaknesses.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">⚠️ Areas to Improve</p>
                    <ul className="space-y-2">
                      {overallEvaluation.weaknesses.map((weakness, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="flex items-start gap-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 p-3"
                        >
                          <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{weakness}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {overallEvaluation.suggestions.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">💡 Suggestions for Improvement</p>
                <ul className="space-y-2">
                  {overallEvaluation.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3"
                    >
                      <TrendingUp className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={hasSaved || resultScore === null}
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ClipboardList className="h-5 w-5" />
                {hasSaved ? 'Saved to history' : 'Save to history'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetInterview}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                Start Over
              </motion.button>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                View History
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Interview
