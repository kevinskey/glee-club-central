
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';
import { Navigate } from 'react-router-dom';

// Import admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';
import UnifiedSlideManagementPage from '@/pages/admin/UnifiedSlideManagementPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  // Redirect V2 to main admin dashboard to avoid confusion
  {
    path: '/admin/v2',
    element: <Navigate to="/admin" replace />,
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
