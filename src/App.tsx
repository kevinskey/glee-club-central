
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import CalendarPage from '@/pages/CalendarPage';
import ProfilePage from '@/pages/ProfilePage';
import MemberProfilePage from '@/pages/MemberProfilePage';
import MemberEditPage from '@/pages/MemberEditPage';
import MemberAddPage from '@/pages/MemberAddPage';
import AdminUserManagementPage from '@/pages/AdminUserManagementPage';
import MemberDirectoryPage from '@/pages/MemberDirectoryPage';
import NotFoundPage from '@/pages/NotFoundPage';
import InviteMemberPage from '@/pages/InviteMemberPage';
import FanPage from '@/pages/FanPage';

import { Outlet } from "react-router-dom";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  const { isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/fan-page" element={<FanPage />} />
        
        {/* Protected routes with role-based access */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="profile" element={<MemberProfilePage />} />
          <Route path="profile/:id" element={<MemberProfilePage />} />
          <Route path="schedule" element={<CalendarPage />} /> {/* Redirect schedule to calendar */}
          
          {/* Member directory and management */}
          <Route path="member-directory" element={<MemberDirectoryPage />} />
          <Route path="member-management" element={<AdminUserManagementPage />} />
          <Route path="invite-member" element={<InviteMemberPage />} />
          <Route path="/dashboard/members/:id" element={<MemberProfilePage />} />
          <Route path="/dashboard/members/edit/:id" element={<MemberEditPage />} />
          <Route path="/dashboard/members/add" element={<MemberAddPage />} />
        </Route>

        {/* Catch all for 404 errors */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
