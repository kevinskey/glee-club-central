
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
      { path: 'members', element: <UserManagementPage /> },
      { path: 'media', element: <MediaLibraryPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
];
