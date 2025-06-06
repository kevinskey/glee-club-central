
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import AppLayout from '@/layouts/AppLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import all pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CalendarPage from '@/pages/CalendarPage';
import StorePage from '@/pages/StorePage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

// Dashboard Pages
import MemberDashboardPage from '@/pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '@/pages/dashboard/FanDashboardPage';
import RoleDashboardPage from '@/pages/RoleDashboardPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ProfileProvider>
              <Router>
                <AppLayout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/store" element={<StorePage />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<RoleDashboardPage />} />
                    <Route path="/role-dashboard" element={<RoleDashboardPage />} />
                    <Route path="/dashboard/member" element={<MemberDashboardPage />} />
                    <Route path="/dashboard/fan" element={<FanDashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/calendar" element={<AdminCalendarPage />} />
                    <Route path="/admin/media-library" element={<AdminMediaLibraryPage />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AppLayout>
              </Router>
              <Toaster />
            </ProfileProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
