
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthRoute from '@/components/auth/AuthRoute';

// Dashboard Pages
import MemberDashboardPage from '@/pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '@/pages/dashboard/FanDashboardPage';

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
];
