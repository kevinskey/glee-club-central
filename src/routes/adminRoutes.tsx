import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';
import { Navigate } from 'react-router-dom';

// Import admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';
import UnifiedSlideManagementPage from '@/pages/admin/UnifiedSlideManagementPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/calendar',
    element: (
      <AdminRoute>
        <AdminCalendarPage />
      </AdminRoute>
    ),
  },
  // Keep V2 route available for comparison
  {
    path: '/admin/v2',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/admin/unified-slide-management',
    element: (
      <AdminRoute>
        <UnifiedSlideManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/media',
    element: (
      <AdminRoute>
        <AdminMediaLibraryPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/media-library',
    element: (
      <AdminRoute>
        <AdminMediaLibraryPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/site-images',
    element: (
      <AdminRoute>
        <SiteImagesPage />
      </AdminRoute>
    ),
  },
];
