
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';

// Import existing admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminMediaLibraryPage from '@/pages/admin/AdminMediaLibraryPage';
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';
import EventRSVPsPage from '@/pages/admin/EventRSVPsPage';

// Import additional admin pages
import AdminMediaUploaderPage from '@/pages/admin/AdminMediaUploaderPage';
import NewsTickerSettingsPage from '@/pages/admin/NewsTickerSettingsPage';

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
  {
    path: '/admin/events/:id',
    element: (
      <AdminRoute>
        <EventDetailsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/events/:id/rsvps',
    element: (
      <AdminRoute>
        <EventRSVPsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/members',
    element: (
      <AdminRoute>
        <UserManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/media-uploader',
    element: (
      <AdminRoute>
        <AdminMediaUploaderPage />
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
    path: '/admin/news-ticker',
    element: (
      <AdminRoute>
        <NewsTickerSettingsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/orders',
    element: (
      <AdminRoute>
        <OrdersPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <AdminRoute>
        <AnalyticsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/announcements',
    element: (
      <AdminRoute>
        <AnnouncementsPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <AdminRoute>
        <SettingsPage />
      </AdminRoute>
    ),
  },
];
