import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Interview = lazy(() => import('./pages/Interview'))
const History = lazy(() => import('./pages/History'))
const Resources = lazy(() => import('./pages/Resources'))
const Profile = lazy(() => import('./pages/Profile'))
const PracticeMCQ = lazy(() => import('./pages/PracticeMCQ'))

const PageFallback = () => (
  <div className="flex h-72 items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-primary" />
  </div>
)

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <Interview />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <PracticeMCQ />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <History />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <Resources />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)

export default App


