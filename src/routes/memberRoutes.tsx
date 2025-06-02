
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuthRoute from '@/components/auth/AuthRoute';

// Member Pages
import MemberDashboardPage from '@/pages/dashboard/MemberDashboardPage';
import SheetMusicPage from '@/pages/SheetMusicPage';
import RecordingStudioPage from '@/pages/recordings/RecordingStudioPage';
import MyOrdersPage from '@/pages/MyOrdersPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProfilePage from '@/pages/ProfilePage';

export const memberRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <AuthRoute>
        <MemberDashboardPage />
      </AuthRoute>
    ),
  },
  {
    path: 'sheet-music',
    element: (
      <AuthRoute>
        <SheetMusicPage />
      </AuthRoute>
    ),
  },
  {
    path: 'recording-studio',
    element: (
      <AuthRoute>
        <RecordingStudioPage />
      </AuthRoute>
    ),
  },
  {
    path: 'my-orders',
    element: (
      <AuthRoute>
        <MyOrdersPage />
      </AuthRoute>
    ),
  },
  {
    path: 'checkout',
    element: (
      <AuthRoute>
        <CheckoutPage />
      </AuthRoute>
    ),
  },
  {
    path: 'profile',
    element: (
      <AuthRoute>
        <ProfilePage />
      </AuthRoute>
    ),
  },
];
