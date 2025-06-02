
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AuthRoute } from '@/components/auth/AuthRoute';
import ProfilePage from '@/pages/ProfilePage';

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: (
      <AuthRoute>
        <ProfilePage />
      </AuthRoute>
    ),
  },
];
