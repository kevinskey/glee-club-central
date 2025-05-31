
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { PageLoader } from '@/components/ui/page-loader';

// Admin Pages
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import MembersPage from '@/pages/members/MembersPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import OrdersPage from '@/pages/admin/OrdersPage';

// Lazy Load Heavy Admin Pages
const AdminDashboardPage = React.lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminMediaUploaderPage = React.lazy(() => import('@/pages/admin/AdminMediaUploaderPage'));
const AdminHeroManager = React.lazy(() => import('@/pages/admin/AdminHeroManager'));
const UserManagementPage = React.lazy(() => import('@/pages/admin/UserManagementPage'));
const EventDetailsPage = React.lazy(() => import('@/pages/events/EventDetailsPage'));
const FanTagManagerPage = React.lazy(() => import('@/pages/admin/FanTagManagerPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminRoute><AppLayout sidebarType="admin" showHeader={true} showFooter={false} /></AdminRoute>,
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboardPage />
          </Suspense>
        )
      },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { 
        path: 'events/:id', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <EventDetailsPage />
          </Suspense>
        )
      },
      { path: 'members', element: <MembersPage /> },
      { 
        path: 'user-management', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserManagementPage />
          </Suspense>
        )
      },
      { 
        path: 'users', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserManagementPage />
          </Suspense>
        )
      },
      { 
        path: 'media-uploader', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminMediaUploaderPage />
          </Suspense>
        )
      },
      { 
        path: 'hero-manager', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminHeroManager />
          </Suspense>
        )
      },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { 
        path: 'fan-tags', 
        element: (
          <Suspense fallback={<PageLoader />}>
            <FanTagManagerPage />
          </Suspense>
        )
      },
    ],
  },
];
