import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import { useStreak } from '../hooks/useStreak'
import { useAchievements } from '../hooks/useAchievements'
import { extendedMCQQuestions } from '../data/sampleData'

type MCQ = {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const mockMCQs: MCQ[] = extendedMCQQuestions

const PracticeMCQ = () => {
  const { incrementStreak } = useStreak()
  const { checkAchievements, unlockAchievement } = useAchievements()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  const currentQuestion = mockMCQs[currentIndex]
  const isCorrect = selectedOption === currentQuestion.correct

  const handleOptionSelect = (index: number) => {
    if (showResult) return
    setSelectedOption(index)
    setShowResult(true)
    if (index === currentQuestion.correct) {
      setScore((prev) => prev + 1)
    }
    setAnswers((prev) => [...prev, index])
  }

  const handleNext = () => {
    if (currentIndex < mockMCQs.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowResult(false)
    } else {
      setCompleted(true)
      const finalScore = Math.round(((score + (selectedOption === currentQuestion.correct ? 1 : 0)) / mockMCQs.length) * 100)
      incrementStreak()
      checkAchievements({
        totalInterviews: 0,
        highestScore: finalScore,
        streak: 0,
      })
      if (finalScore >= 80) {
        unlockAchievement('score-80')
      }
      if (finalScore >= 90) {
        unlockAchievement('score-90')
      }
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
    setAnswers([])
  }

  const progress = ((currentIndex + 1) / mockMCQs.length) * 100
  const finalScore = completed
    ? Math.round((score / mockMCQs.length) * 100)
    : Math.round(((score + (selectedOption === currentQuestion.correct ? 1 : 0)) / mockMCQs.length) * 100)

  const correctAnswers = useMemo(() => {
    return answers.filter((ans, idx) => ans === mockMCQs[idx].correct).length
  }, [answers])

  const wrongAnswers = mockMCQs.length - correctAnswers
  const weakAreas = useMemo(() => {
    const wrongIndices = answers
      .map((ans, idx) => (ans !== mockMCQs[idx].correct ? idx : -1))
      .filter((idx) => idx !== -1)
    return wrongIndices.slice(0, 3).map((idx) => mockMCQs[idx].question.split('?')[0] + '?')
  }, [answers])

  if (completed) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Practice Complete!</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            You scored {score} out of {mockMCQs.length}
          </p>
          <div className="mt-8">
            <div className="text-6xl font-bold gradient-text">{finalScore}%</div>
            <div className="mt-4 h-4 w-full max-w-md mx-auto rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${finalScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full gradient-primary"
              />
            </div>
          </div>

          {/* Result Summary */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-2xl mx-auto text-left">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Correct Answers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{correctAnswers}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">Wrong Answers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{wrongAnswers}</p>
            </div>
          </div>

          {weakAreas.length > 0 && (
            <div className="mt-6 max-w-2xl mx-auto text-left">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Areas to Improve:</p>
              <ul className="space-y-2">
                {weakAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="gradient-primary rounded-xl px-6 py-3 font-semibold text-white shadow-lg"
            >
              <RotateCcw className="mr-2 inline h-5 w-5" />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Practice MCQ
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Your Knowledge</h1>
        <p className="text-gray-600 dark:text-gray-400">Answer multiple choice questions to improve your skills</p>
      </header>

      {/* Progress Bar */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Question {currentIndex + 1} of {mockMCQs.length}
          </span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full gradient-primary"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{currentQuestion.question}</h2>
        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index
            const isCorrectOption = index === currentQuestion.correct
            const showCorrect = showResult && isCorrectOption
            const showIncorrect = showResult && isSelected && !isCorrectOption

            return (
              <motion.button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  showCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : showIncorrect
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : isSelected
                    ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800/50 hover:border-primary'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{option}</span>
                  {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              </motion.button>
            )
          })}
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20"
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white">Explanation:</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
          </motion.div>
        )}

        {showResult && (
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg"
            >
              {currentIndex < mockMCQs.length - 1 ? 'Next Question' : 'Finish'}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PracticeMCQ


