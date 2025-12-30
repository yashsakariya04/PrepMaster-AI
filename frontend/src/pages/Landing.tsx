import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap, Target, BookOpen, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ interviews: 0, users: 0, success: 0 })

  useEffect(() => {
    // Animated counter effect
    const interval = setInterval(() => {
      setStats((prev) => ({
        interviews: Math.min(prev.interviews + 10, 10000),
        users: Math.min(prev.users + 5, 5000),
        success: Math.min(prev.success + 1, 95),
      }))
    }, 50)

    setTimeout(() => clearInterval(interval), 2000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Mock Interviews',
      description: 'Practice with real interview questions and get instant feedback',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'MCQ Practice',
      description: 'Test your knowledge with multiple choice questions',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Achievements',
      description: 'Unlock badges and maintain your practice streak',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      text: 'PrepMaster+ helped me land my dream job. The practice questions were spot-on!',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      text: 'The dashboard analytics gave me insights I never had before. Highly recommend!',
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist',
      text: 'Best interview prep tool I\'ve used. Clean UI and comprehensive features.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="gradient-text">PrepMaster+</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Master your interviews with AI-powered practice and real-time feedback
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-400"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { label: 'Interviews Completed', value: stats.interviews, suffix: '+' },
              { label: 'Active Users', value: stats.users, suffix: '+' },
              { label: 'Success Rate', value: stats.success, suffix: '%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass rounded-2xl p-6 text-center hover-glow"
              >
                <div className="text-4xl font-bold text-primary">{stat.value}{stat.suffix}</div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to ace your interviews
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed to help you succeed
            </p>
          </motion.div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 hover-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-primary dark:bg-blue-900/30">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Loved by thousands of job seekers
            </h2>
          </motion.div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover-glow"
              >
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Zap key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">&quot;{testimonial.text}&quot;</p>
                <div className="mt-6">
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Ready to land your dream job?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Join thousands of successful candidates who prepared with PrepMaster+
            </p>
            {!user && (
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Landing


