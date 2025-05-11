
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { PermissionGuard } from './components/auth/PermissionGuard';
import UserManagementPage from './pages/admin/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import { Suspense } from 'react';
import { Spinner } from './components/ui/spinner';

// Lazy load additional pages
const SheetMusicPage = React.lazy(() => import('./pages/SheetMusicPage'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const AnnouncementsPage = React.lazy(() => import('./pages/AnnouncementsPage'));
const FinancesPage = React.lazy(() => import('./pages/FinancesPage'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes with MainLayout */}
      <Route path="/dashboard" element={
        <PermissionGuard>
          <MainLayout />
        </PermissionGuard>
      }>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<UserProfilePage />} />
        
        <Route path="sheet-music" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>}>
            <PermissionGuard requiredPermission="view_sheet_music">
              <SheetMusicPage />
            </PermissionGuard>
          </Suspense>
        } />
        
        <Route path="calendar" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>}>
            <PermissionGuard requiredPermission="view_calendar">
              <CalendarPage />
            </PermissionGuard>
          </Suspense>
        } />
        
        <Route path="announcements" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>}>
            <PermissionGuard requiredPermission="view_announcements">
              <AnnouncementsPage />
            </PermissionGuard>
          </Suspense>
        } />
        
        <Route path="finances" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>}>
            <PermissionGuard requiredPermission="view_financials">
              <FinancesPage />
            </PermissionGuard>
          </Suspense>
        } />
        
        {/* Admin routes */}
        <Route path="admin/members" element={
          <PermissionGuard requiredPermission="manage_users">
            <UserManagementPage />
          </PermissionGuard>
        } />
      </Route>
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
