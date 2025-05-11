
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PermissionGuard } from './components/auth/PermissionGuard';
import { Spinner } from './components/ui/spinner';

// Simple placeholder component for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>This page is under development.</p>
  </div>
);

// Use these components for now
const Dashboard = () => <PlaceholderPage title="Dashboard" />;
const Login = () => <PlaceholderPage title="Login" />;
const Register = () => <PlaceholderPage title="Register" />;
const NotFound = () => <PlaceholderPage title="404 - Not Found" />;
const UserProfilePage = () => <PlaceholderPage title="User Profile" />;
const UserManagementPage = React.lazy(() => import('./pages/admin/UserManagementPage'));

// Layout component
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto py-4">{children}</div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes with MainLayout */}
      <Route path="/dashboard" element={
        <PermissionGuard>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </PermissionGuard>
      } />
      
      <Route path="/dashboard/profile" element={
        <PermissionGuard>
          <MainLayout>
            <UserProfilePage />
          </MainLayout>
        </PermissionGuard>
      } />
      
      {/* Admin routes */}
      <Route path="/dashboard/admin/members" element={
        <PermissionGuard requiredPermission="manage_users">
          <MainLayout>
            <React.Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
              </div>
            }>
              <UserManagementPage />
            </React.Suspense>
          </MainLayout>
        </PermissionGuard>
      } />
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
