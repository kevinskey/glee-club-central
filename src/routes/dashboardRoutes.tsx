
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthRoute from '@/components/auth/AuthRoute';

// Dashboard Pages
import MemberDashboardPage from '@/pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '@/pages/dashboard/FanDashboardPage';
import SoundCloudLibraryPage from '@/pages/dashboard/SoundCloudLibraryPage';

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard/member',
    element: (
      <AuthRoute>
        <MemberDashboardPage />
      </AuthRoute>
    ),
  },
  {
    path: '/dashboard/fan',
    element: (
      <AuthRoute>
        <FanDashboardPage />
      </AuthRoute>
    ),
  },
  {
    path: '/dashboard/soundcloud',
    element: (
      <AuthRoute>
        <SoundCloudLibraryPage />
      </AuthRoute>
    ),
  },
];
