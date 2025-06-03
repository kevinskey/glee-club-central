import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

// Import page components
import LandingPage from '@/pages/HomePage';
import DashboardPage from '@/pages/dashboard/DashboardHome';
import SheetMusicPage from '@/pages/SheetMusicPage';
import CalendarPage from '@/pages/CalendarPage';
import AttendancePage from '@/pages/AttendancePage';
import ProfilePage from '@/pages/ProfilePage';
import PracticePage from '@/pages/practice/PracticePage';
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage';
import ContactAdminPage from '@/pages/ContactAdminPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboard';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import MediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import EventManagerPage from '@/pages/events/EventsListPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import SimpleLoginPage from '@/pages/auth/SimpleLoginPage';
import SignUpPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import AdminRoute from '@/components/auth/AdminRoute';
import RecordingsPage from '@/pages/recordings/RecordingsPage';
import RecordingStudioPage from '@/pages/recordings/RecordingStudioPage';
import EventsListPage from '@/pages/events/EventsListPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';
import FanDashboardPage from '@/pages/FanDashboardPage';

import SoundCloudPage from '@/pages/SoundCloudPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<SimpleLoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Dashboard Routes - Accessible to all authenticated users */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/sheet-music" element={<SheetMusicPage />} />
                <Route path="/dashboard/calendar" element={<CalendarPage />} />
                <Route path="/dashboard/attendance" element={<AttendancePage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/practice" element={<PracticePage />} />
                <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
                <Route path="/dashboard/contact" element={<ContactAdminPage />} />
                <Route path="/dashboard/recordings" element={<RecordingsPage />} />
                <Route path="/dashboard/recording-studio" element={<RecordingStudioPage />} />
                <Route path="/dashboard/events" element={<EventsListPage />} />
                <Route path="/dashboard/events/:eventId" element={<EventDetailsPage />} />
                <Route path="/fan-dashboard" element={<FanDashboardPage />} />

                {/* Admin Routes - Accessible only to admins */}
                <Route path="/dashboard/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/dashboard/admin/members" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
                <Route path="/dashboard/admin/media" element={<AdminRoute><MediaLibraryPage /></AdminRoute>} />
                <Route path="/dashboard/admin/events" element={<AdminRoute><EventManagerPage /></AdminRoute>} />
                <Route path="/dashboard/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
                
                {/* Add SoundCloud route */}
                <Route path="/dashboard/soundcloud" element={<SoundCloudPage />} />
              </Routes>
            </div>
            <Toaster />
            <SonnerToaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
