import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  loading: boolean
  authActionLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'prepai_user'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authActionLoading, setAuthActionLoading] = useState(false)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY)
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as User
        if (parsed && parsed.email && parsed.name) {
          setUser(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const persistUser = (value: User | null) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const login = async (email: string, password: string) => {
    setAuthActionLoading(true)
    await wait(600)
    
    if (!email.trim()) {
      setAuthActionLoading(false)
      throw new Error('Email is required.')
    }
    
    if (password.trim().length < 6) {
      setAuthActionLoading(false)
      throw new Error('Password must be at least 6 characters.')
    }
    
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY)
      if (!storedUser) {
        setAuthActionLoading(false)
        throw new Error('Account not found. Please sign up first.')
      }
      
      const parsed = JSON.parse(storedUser) as User
      if (!parsed || !parsed.email) {
        setAuthActionLoading(false)
        throw new Error('Invalid account data. Please sign up again.')
      }
      
      // Check if email matches (case-insensitive)
      if (parsed.email.toLowerCase() !== email.trim().toLowerCase()) {
        setAuthActionLoading(false)
        throw new Error('Email does not match our records.')
      }
      
      // Password check is simplified for demo (just length check)
      // In production, you would verify hashed password
      setUser(parsed)
      setAuthActionLoading(false)
    } catch (error) {
      setAuthActionLoading(false)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Login failed. Please try again.')
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setAuthActionLoading(true)
    await wait(800)
    
    if (!name.trim()) {
      setAuthActionLoading(false)
      throw new Error('Name is required.')
    }
    
    if (!email.trim()) {
      setAuthActionLoading(false)
      throw new Error('Email is required.')
    }
    
    if (password.trim().length < 6) {
      setAuthActionLoading(false)
      throw new Error('Password must be at least 6 characters.')
    }
    
    try {
      // Check if user already exists
      const existingUser = localStorage.getItem(STORAGE_KEY)
      if (existingUser) {
        const parsed = JSON.parse(existingUser) as User
        if (parsed.email.toLowerCase() === email.trim().toLowerCase()) {
          setAuthActionLoading(false)
          throw new Error('An account with this email already exists. Please log in instead.')
        }
      }
      
      const newUser: User = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        skills: [],
        goals: '',
      }
      persistUser(newUser)
      setUser(newUser)
      setAuthActionLoading(false)
    } catch (error) {
      setAuthActionLoading(false)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Signup failed. Please try again.')
    }
  }

  const logout = () => {
    persistUser(null)
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const merged = { ...prev, ...updates }
      persistUser(merged)
      return merged
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, authActionLoading, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


