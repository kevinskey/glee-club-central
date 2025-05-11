
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PermissionRoute } from "@/components/auth/PermissionRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import PressKitPage from "@/pages/PressKitPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import ContactPage from "@/pages/ContactPage";

// Dashboard Pages
import DashboardPage from "@/pages/DashboardPage";
import SchedulePage from "@/pages/schedule/SchedulePage";
import ProfilePage from "@/pages/profile/ProfilePage";
import MediaLibraryPage from "@/pages/media-library/MediaLibraryPage";

// Admin Pages
import UserManagementPage from "@/pages/admin/UserManagementPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminMembersPage from "@/pages/AdminMembersPage";

function App() {
  console.log("App component rendering");
  
  return (
    <SidebarProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/press-kit" element={<PressKitPage />} />
        <Route path="/contact" element={<ContactPage />} />
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
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="media-library" element={<MediaLibraryPage />} />
          
          {/* Admin-only routes */}
          <Route 
            path="admin/users" 
            element={
              <PermissionRoute requiredPermission="can_manage_users">
                <UserManagementPage />
              </PermissionRoute>
            } 
          />
          
          <Route 
            path="admin/members" 
            element={
              <PermissionRoute requiredPermission="can_manage_users">
                <AdminMembersPage />
              </PermissionRoute>
            } 
          />
          
          <Route 
            path="admin/dashboard" 
            element={
              <PermissionRoute requireSuperAdmin>
                <AdminDashboardPage />
              </PermissionRoute>
            } 
          />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
