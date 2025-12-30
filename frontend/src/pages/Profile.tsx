import type { FormEvent, ChangeEvent } from 'react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, UserCog, Target, Code, Plus, X, Award, Camera, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useAchievements } from '../hooks/useAchievements'
import { readHistory } from '../utils/storage'

// Predefined skills list
const PREDEFINED_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Git',
  'REST API',
  'GraphQL',
  'System Design',
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'UI/UX Design',
  'Agile',
  'Scrum',
  'Leadership',
  'Communication',
  'Problem Solving',
]

const Profile = () => {
  const { user, updateUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { achievements } = useAchievements()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [skills, setSkills] = useState<string[]>(user?.skills ?? [])
  const [selectedSkill, setSelectedSkill] = useState('')
  const [goals, setGoals] = useState(user?.goals ?? '')
  const [profilePicture, setProfilePicture] = useState<string>(user?.profilePicture || '')
  const [message, setMessage] = useState<string | null>(null)
  const [historyCount, setHistoryCount] = useState(0)
  const [avgScore, setAvgScore] = useState(0)

  useEffect(() => {
    setName(user?.name ?? '')
    setSkills(user?.skills ?? [])
    setGoals(user?.goals ?? '')
    setProfilePicture(user?.profilePicture || '')
  }, [user])

  useEffect(() => {
    const history = readHistory()
    setHistoryCount(history.length)
    if (history.length) {
      const avg = Math.round(history.reduce((sum, record) => sum + record.score, 0) / history.length)
      setAvgScore(avg)
    } else {
      setAvgScore(0)
    }
  }, [])

  const hoursPracticed = useMemo(() => (historyCount * 0.5).toFixed(1), [historyCount])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setMessage('Name is required.')
      return
    }
    updateUser({
      name: name.trim(),
      skills,
      goals,
      profilePicture,
    })
    setMessage('Profile updated successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAddSkill = (skill?: string) => {
    const skillToAdd = skill || selectedSkill
    if (skillToAdd.trim() && !skills.includes(skillToAdd.trim())) {
      setSkills([...skills, skillToAdd.trim()])
      setSelectedSkill('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image size must be less than 2MB')
        setTimeout(() => setMessage(null), 3000)
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePicture(base64String)
        updateUser({ profilePicture: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfilePicture('')
    updateUser({ profilePicture: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt !== null)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Profile</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your information and track your progress</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <UserCog className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Details</h2>
          </div>
          <div className="space-y-5">
            {/* Profile Picture Section */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-primary shadow-lg"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  >
                    Change Photo
                  </button>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePicture}
                      className="ml-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Max size: 2MB</p>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-name">
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                  >
                    <option value="">Select a skill to add...</option>
                    {PREDEFINED_SKILLS.filter((skill) => !skills.includes(skill)).map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={!selectedSkill}
                    className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Or type a custom skill:
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Type custom skill"
                    className="flex-1 rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={!selectedSkill.trim()}
                    className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-primary dark:bg-blue-900/30"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-blue-700 dark:hover:text-blue-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="goals">
                Career Goals
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={4}
                placeholder="What are your career goals?"
                className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white/50 px-4 py-3 text-left transition hover:border-primary dark:border-gray-600 dark:bg-gray-800/50"
              >
                <span className="text-gray-900 dark:text-white">Current theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                <span className="text-primary">Toggle</span>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm text-green-600 dark:text-green-400"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gradient-primary rounded-xl px-6 py-3 font-semibold text-white shadow-lg"
            >
              Save Changes
            </motion.button>
            <motion.button
              type="button"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </motion.form>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Total interviews</p>
            <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{historyCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Average score</p>
            <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{avgScore}%</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Hours practiced</p>
            <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{hoursPracticed}</p>
          </motion.div>
          {unlockedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg"
            >
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Achievements</p>
              </div>
              <div className="space-y-2">
                {unlockedAchievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="flex items-center gap-2 text-sm">
                    <span>{ach.icon}</span>
                    <span className="text-gray-900 dark:text-white">{ach.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-lg"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Account Info</p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Joined: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Last login: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile


