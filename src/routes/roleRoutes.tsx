
import React from 'react';
import { RouteObject } from 'react-router-dom';
import RoleDashboardPage from '@/pages/RoleDashboardPage';

export const roleRoutes: RouteObject[] = [
  {
    path: '/role-dashboard',
    element: <RoleDashboardPage />,
  },
];
