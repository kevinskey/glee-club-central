
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";

// Dashboard Pages
import DashboardPage from "@/pages/dashboard/DashboardPage";
import SchedulePage from "@/pages/schedule/SchedulePage";

// Admin Pages
import UserManagementPage from "@/pages/admin/UserManagementPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

function App() {
  return (
    <SidebarProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
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
          
          {/* Admin-only routes */}
          <Route 
            path="admin/users" 
            element={
              <ProtectedRoute adminOnly>
                <UserManagementPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="admin/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Add other routes as needed */}
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
