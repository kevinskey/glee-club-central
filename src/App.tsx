
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
import NotFoundPage from '@/pages/NotFoundPage';
import InviteMemberPage from '@/pages/InviteMemberPage';
import FanPage from '@/pages/FanPage';
import AdminUserManagementPage from '@/pages/AdminUserManagementPage';

import { Outlet } from "react-router-dom";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="schedule" element={<CalendarPage />} /> {/* Redirect schedule to calendar */}
          
          {/* Admin and section leader routes */}
          <Route path="sections" element={
            <ProtectedRoute allowedRoles={["admin", "section_leader"]}>
              <SectionsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin-only routes */}
          <Route path="users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MemberDirectoryPage />
            </ProtectedRoute>
          } />
          <Route path="user-management" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="admin-users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="members" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MemberDirectoryPage />
            </ProtectedRoute>
          } />
          <Route path="invite-member" element={
            <ProtectedRoute allowedRoles={["admin", "section_leader"]}>
              <InviteMemberPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Remove the Index route as it causes conflicts */}
        
        {/* Catch all for 404 errors */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
