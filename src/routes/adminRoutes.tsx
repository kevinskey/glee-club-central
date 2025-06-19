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
import SoundCloudAdminPage from '@/pages/admin/SoundCloudAdminPage';
import AdminStorePage from '@/pages/admin/AdminStorePage';
import CommunicationsPage from '@/pages/admin/CommunicationsPage';
import EmailServiceManagementPage from '@/pages/admin/EmailServiceManagementPage';
import AdminAnalyticsPage from '@/pages/AdminAnalyticsPage';
import AdminVideosPage from '@/pages/admin/AdminVideosPage';
import SiteSettingsPage from '@/pages/admin/SiteSettingsPage';
import UserRolesPage from '@/pages/admin/UserRolesPage';
import FinancialPage from '@/pages/admin/FinancialPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import MyProfilePage from '@/pages/admin/MyProfilePage';

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
        path: 'profile',
        element: <MyProfilePage />,
      },
      {
        path: 'members',
        element: <MembersPage />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'user-roles',
        element: <UserRolesPage />,
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
        path: 'soundcloud',
        element: <SoundCloudAdminPage />,
      },
      {
        path: 'videos',
        element: <AdminVideosPage />,
      },
      {
        path: 'store',
        element: <AdminStorePage />,
      },
      {
        path: 'communications',
        element: <CommunicationsPage />,
      },
      {
        path: 'email-services',
        element: <EmailServiceManagementPage />,
      },
      {
        path: 'news-items',
        element: <CommunicationsPage />,
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
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SiteSettingsPage />,
      },
      {
        path: 'financial',
        element: <FinancialPage />,
      },
    ],
  },
];
