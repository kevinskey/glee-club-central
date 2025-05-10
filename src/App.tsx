
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";

// Dashboard Pages
import DashboardPage from "@/pages/dashboard/DashboardPage";

// Admin Pages
import UserManagementPage from "@/pages/admin/UserManagementPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
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
              
              {/* Admin-only routes */}
              <Route 
                path="admin/users" 
                element={
                  <ProtectedRoute adminOnly>
                    <UserManagementPage />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
