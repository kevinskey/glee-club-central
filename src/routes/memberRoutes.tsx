
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import MembersPage from '@/pages/MembersPage';

export const memberRoutes: RouteObject[] = [
  {
    path: '/members',
    element: (
      <AdminLayout>
        <MembersPage />
      </AdminLayout>
    ),
  },
];
