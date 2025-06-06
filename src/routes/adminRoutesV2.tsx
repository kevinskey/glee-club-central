
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminDashboardV2 from '@/pages/admin/AdminDashboardV2';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminStorePage from '@/pages/admin/AdminStorePage';
import AdminCalendarPage from '@/pages/admin/AdminCalendarPage';
import SettingsPage from '@/pages/admin/SettingsPage';

export const adminRoutesV2: RouteObject[] = [
  {
    path: 'admin-v2',
    children: [
      { index: true, element: <AdminDashboardV2 /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'store', element: <AdminStorePage /> },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];
