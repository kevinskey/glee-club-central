
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthRoute from '@/components/auth/AuthRoute';

// Member Pages
import DashboardPage from '@/pages/DashboardPage';
import SheetMusicPage from '@/pages/SheetMusicPage';
import RecordingStudioPage from '@/pages/RecordingStudioPage';
import MyOrdersPage from '@/pages/MyOrdersPage';
import CheckoutPage from '@/pages/CheckoutPage';
import MyProfilePage from '@/pages/MyProfilePage';

export const memberRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <AuthRoute>
        <DashboardPage />
      </AuthRoute>
    ),
  },
  {
    path: '/sheet-music',
    element: (
      <AuthRoute>
        <SheetMusicPage />
      </AuthRoute>
    ),
  },
  {
    path: '/recording-studio',
    element: (
      <AuthRoute>
        <RecordingStudioPage />
      </AuthRoute>
    ),
  },
  {
    path: '/my-orders',
    element: (
      <AuthRoute>
        <MyOrdersPage />
      </AuthRoute>
    ),
  },
  {
    path: '/checkout',
    element: (
      <AuthRoute>
        <CheckoutPage />
      </AuthRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthRoute>
        <MyProfilePage />
      </AuthRoute>
    ),
  },
];
