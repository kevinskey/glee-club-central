import React from 'react';
import { RouteObject } from 'react-router-dom';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import AppLayout from '@/layouts/AppLayout';

// Import all existing admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import AdminMembersPage from '@/pages/admin/AdminMembersPage';
import AdminMediaPage from '@/pages/admin/AdminMediaPage';
import AdminAnnouncementsPage from '@/pages/admin/AdminAnnouncementsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import EventDetailsPage from '@/pages/events/EventDetailsPage';
import EventRSVPsPage from '@/pages/admin/EventRSVPsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AppLayout sidebarType="admin" showHeader={true} showFooter={false} />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> },
      { path: 'events/:id/rsvps', element: <EventRSVPsPage /> },
      { path: 'members', element: <AdminMembersPage /> },
      { path: 'media', element: <AdminMediaPage /> },
      { path: 'announcements', element: <AdminAnnouncementsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },
];
