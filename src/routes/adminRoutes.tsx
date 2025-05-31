
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import MembersPage from '@/pages/members/MembersPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminMediaUploaderPage from '@/pages/admin/AdminMediaUploaderPage';
import AdminHeroManager from '@/pages/admin/AdminHeroManager';
import OrdersPage from '@/pages/admin/OrdersPage';
import SettingsPage from '@/pages/admin/SettingsPage';

export const adminRoutes = [
  {
    index: true,
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: 'dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: 'calendar',
    element: <AdminCalendarPage />,
  },
  {
    path: 'members',
    element: <MembersPage />,
  },
  {
    path: 'user-management',
    element: <UserManagementPage />,
  },
  {
    path: 'users',
    element: <UserManagementPage />,
  },
  {
    path: 'media-uploader',
    element: <AdminMediaUploaderPage />,
  },
  {
    path: 'hero-manager',
    element: <AdminHeroManager />,
  },
  {
    path: 'orders',
    element: <OrdersPage />,
  },
  {
    path: 'settings',
    element: <SettingsPage />,
  },
];
