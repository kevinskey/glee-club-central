import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import CalendarPage from '@/pages/CalendarPage';
import ProfilePage from '@/pages/ProfilePage';
import SectionsPage from '@/pages/SectionsPage';
import MemberDirectoryPage from '@/pages/MemberDirectoryPage';
import UserManagementPage from '@/pages/UserManagementPage';
import NotFound from '@/pages/NotFoundPage';
import InviteMemberPage from '@/pages/InviteMemberPage';

// A wrapper for routes that require authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a more appropriate loading indicator
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

// Layout component for dashboard routes
function DashboardLayout() {
  return (
    <div>
      {/* Your dashboard layout components, e.g., Sidebar, Navbar, etc. */}
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router-dom";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route element={<ProtectedRoute />}>
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="sections" element={<SectionsPage />} />
            <Route path="members" element={<MemberDirectoryPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="invite-member" element={<InviteMemberPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
