
import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import SheetMusicPage from './pages/SheetMusicPage'
import MediaLibraryPage from './pages/media-library/MediaLibraryPage'
import RecordingsPage from './pages/RecordingsPage'
import ProfilePage from './pages/ProfilePage'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Add messaging page import
import MessagingPage from "./pages/messaging/MessagingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sheet-music"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SheetMusicPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/media-library"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MediaLibraryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recordings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RecordingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Add messaging route */}
        <Route
          path="/messaging"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MessagingPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const [render, setRender] = useState(false)

  useEffect(() => {
    if (!isLoading) setRender(true)
  }, [isLoading])

  if (!render) {
    return <div></div> // or a loading spinner
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />
  }

  return <>{children}</>
}

export default App
