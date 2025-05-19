
import React from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersPage from '../pages/admin/UsersPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import MediaLibrary from '../pages/admin/MediaLibrary';
import SettingsPage from '../pages/admin/SettingsPage';
import LandingPageSettingsPage from '../pages/admin/LandingPageSettingsPage';
import SiteImagesPage from '../pages/admin/SiteImagesPage';

export const adminRoutes = {
  path: '/admin',
  element: (
    <RequireAuth requireAdmin={true}>
      <AdminLayout />
    </RequireAuth>
  ),
  children: [
    {
      index: true,
      element: <AdminDashboard />
    },
    {
      path: 'users',
      element: <UsersPage />
    },
    {
      path: 'analytics',
      element: <AnalyticsPage />
    },
    {
      path: 'media',
      element: <MediaLibrary />
    },
    {
      path: 'settings',
      element: <SettingsPage />
    },
    {
      path: 'landing-page',
      element: <LandingPageSettingsPage />
    },
    {
      path: 'site-images',
      element: <SiteImagesPage />
    }
  ]
};
