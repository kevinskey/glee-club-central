
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';

// V2 Admin Pages
import AdminDashboardV2 from '@/pages/admin/AdminDashboardV2';
import CalendarV2Page from '@/pages/admin/CalendarV2Page';
import MembersV2Page from '@/pages/admin/MembersV2Page';
import SheetMusicV2Page from '@/pages/admin/SheetMusicV2Page';
import MusicStudioPage from '@/pages/admin/MusicStudioPage';
import StoreV2Page from '@/pages/admin/StoreV2Page';
import PermissionsPage from '@/pages/admin/PermissionsPage';

export const adminRoutesV2: RouteObject[] = [
  {
    path: '/admin/v2',
    element: (
      <AdminRoute>
        <AdminDashboardV2 />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/calendar-v2',
    element: (
      <AdminRoute>
        <CalendarV2Page />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/members-v2',
    element: (
      <AdminRoute>
        <MembersV2Page />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/sheet-music-v2',
    element: (
      <AdminRoute>
        <SheetMusicV2Page />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/music-studio-v2',
    element: (
      <AdminRoute>
        <MusicStudioPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/store-v2',
    element: (
      <AdminRoute>
        <StoreV2Page />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/permissions',
    element: (
      <AdminRoute>
        <PermissionsPage />
      </AdminRoute>
    ),
  },
];
