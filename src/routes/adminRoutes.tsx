import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Navigate } from 'react-router-dom';

// Import admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import MembersPage from '@/pages/admin/MembersPage';
import HeroSlidesPage from '@/pages/admin/HeroSlidesPage';
import MusicAdminPage from '@/pages/admin/MusicAdminPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'members',
        element: <MembersPage />,
      },
      {
        path: 'calendar',
        element: <AdminCalendarPage />,
      },
      {
        path: 'hero-slides',
        element: <HeroSlidesPage />,
      },
      {
        path: 'music',
        element: <MusicAdminPage />,
      },
      {
        path: 'media',
        element: <AdminMediaLibraryPage />,
      },
      {
        path: 'media-library',
        element: <AdminMediaLibraryPage />,
      },
      {
        path: 'site-images',
        element: <SiteImagesPage />,
      },
    ],
  },
  // Keep V2 route available for comparison
  {
    path: '/admin/v2',
    element: <Navigate to="/dashboard" replace />,
  },
];
