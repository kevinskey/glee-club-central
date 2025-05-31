
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';
import AppLayout from '@/layouts/AppLayout';

// Import existing admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import MediaLibraryPage from '@/pages/admin/MediaLibraryPage';
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import OrdersPage from '@/pages/admin/OrdersPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';
import EventRSVPsPage from '@/pages/admin/EventRSVPsPage';
import FanBulkUploadPage from '@/pages/admin/FanBulkUploadPage';

// Import additional admin pages (these may need to be created if they don't exist)
import AdminHeroManager from '@/pages/admin/AdminHeroManager';
import AdminMediaUploaderPage from '@/pages/admin/AdminMediaUploaderPage';
import NewsTickerSettingsPage from '@/pages/admin/NewsTickerSettingsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AppLayout sidebarType="admin" showHeader={true} showFooter={false} />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> },
      { path: 'events/:id/rsvps', element: <EventRSVPsPage /> },
      // Admin member management route - distinct path from member dashboard
      { path: 'members', element: <UserManagementPage /> },
      { path: 'user-management', element: <UserManagementPage /> },
      { path: 'hero-manager', element: <AdminHeroManager /> },
      { path: 'media-uploader', element: <AdminMediaUploaderPage /> },
      { path: 'media', element: <MediaLibraryPage /> },
      { path: 'news-ticker', element: <NewsTickerSettingsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'fan-tags', element: <UserManagementPage /> }, // Can be updated to specific fan tags page
      { path: 'fan-upload', element: <FanBulkUploadPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];
