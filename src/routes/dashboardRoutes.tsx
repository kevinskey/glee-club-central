
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
import FanDashboardPage from '../pages/FanDashboardPage';
import AnnouncementsPage from '../pages/dashboard/AnnouncementsPage';
import ArchivesPage from '../pages/dashboard/ArchivesPage';
import AttendancePage from '../pages/dashboard/AttendancePage';
import DashboardPage from '../pages/dashboard/DashboardPage'; // Using the dashboard page from the correct location

export const dashboardRoutes = {
  path: '/dashboard',
  // Ensure entire dashboard layout requires authentication
  element: <RequireAuth><DashboardLayout /></RequireAuth>,
  children: [
    {
      index: true,
      element: <DashboardPage />, // Use the correct DashboardPage component
    },
    {
      path: 'member',
      element: <RequireAuth allowedUserTypes={['member', 'admin']}><MemberDashboardPage /></RequireAuth>,
    },
    {
      path: 'fan',
      element: <RequireAuth allowedUserTypes={['fan', 'member', 'admin']}><FanDashboardPage /></RequireAuth>,
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
      element: <RequireAuth><CalendarPage /></RequireAuth>,
    },
    {
      path: 'announcements',
      element: <RequireAuth><AnnouncementsPage /></RequireAuth>,
    },
    {
      path: 'archives',
      element: <RequireAuth><ArchivesPage /></RequireAuth>,
    },
    {
      path: 'attendance',
      element: <RequireAuth><AttendancePage /></RequireAuth>,
    },
  ],
};
