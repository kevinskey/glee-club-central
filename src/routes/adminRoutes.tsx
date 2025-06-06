
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminStorePage from '@/pages/admin/AdminStorePage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import SettingsPage from '@/pages/admin/SettingsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'store', element: <AdminStorePage /> },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];
