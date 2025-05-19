
import React from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import RoleDashboard from '../components/auth/RoleDashboard';
import ProfilePage from '../pages/profile/ProfilePage';
import MediaLibraryPage from '../pages/MediaLibraryPage';
import SheetMusicPage from '../pages/SheetMusicPage';
import PDFViewerPage from '../pages/PDFViewerPage';
import RecordingsPage from '../pages/recordings/RecordingsPage';
import CalendarPage from '../pages/dashboard/calendar';
import MemberDashboardPage from '../pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '../pages/dashboard/FanDashboardPage';

export const dashboardRoutes = {
  path: '/dashboard',
  element: <RequireAuth><DashboardLayout /></RequireAuth>,
  children: [
    {
      index: true,
      element: <RoleDashboard />,
    },
    {
      path: 'profile',
      element: <ProfilePage />,
    },
    {
      path: 'media-library',
      element: <RequireAuth allowedUserTypes={['admin', 'member']}><MediaLibraryPage /></RequireAuth>,
    },
    {
      path: 'sheet-music',
      element: <RequireAuth allowedUserTypes={['admin', 'member']}><SheetMusicPage /></RequireAuth>,
    },
    {
      path: 'sheet-music/:id',
      element: <RequireAuth allowedUserTypes={['admin', 'member']}><PDFViewerPage /></RequireAuth>,
    },
    {
      path: 'media/pdf/:id',
      element: <RequireAuth allowedUserTypes={['admin', 'member']}><PDFViewerPage /></RequireAuth>,
    },
    {
      path: 'recordings',
      element: <RequireAuth allowedUserTypes={['admin', 'member']}><RecordingsPage /></RequireAuth>,
    },
    {
      path: 'calendar',
      element: <CalendarPage />,
    },
    {
      path: 'member',
      element: <RequireAuth allowedUserTypes={['member', 'admin']}><MemberDashboardPage /></RequireAuth>,
    },
    {
      path: 'fan',
      element: <RequireAuth allowedUserTypes={['fan', 'member', 'admin']}><FanDashboardPage /></RequireAuth>,
    },
  ],
};
