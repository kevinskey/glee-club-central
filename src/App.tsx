
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import CalendarPage from './pages/CalendarPage';
import SheetMusicPage from './pages/SheetMusicPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RecordingsPage from './pages/RecordingsPage';
import LandingPage from './pages/LandingPage';
import FanPage from './pages/FanPage';
import AttendancePage from './pages/AttendancePage';
import PerformanceChecklistPage from './pages/PerformanceChecklistPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/fan-page" element={<FanPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      
      {/* Protected dashboard routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="sheet-music" element={<SheetMusicPage />} />
        <Route path="practice" element={<div>Practice Page</div>} />
        <Route path="recordings" element={<RecordingsPage />} />
        <Route path="videos" element={<div>Videos Page</div>} />
        <Route path="dues" element={<div>Dues Payment Page</div>} />
        <Route path="handbook" element={<div>Handbook Page</div>} />
        <Route path="merch" element={<div>Merchandise Page</div>} />
        <Route path="media-library" element={<div>Media Library Page</div>} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="members" element={<div>Members Page</div>} />
        <Route path="announcements" element={<div>Announcements Page</div>} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="messages" element={<div>Messages Page</div>} />
        <Route path="performance-checklist" element={<PerformanceChecklistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      
      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
