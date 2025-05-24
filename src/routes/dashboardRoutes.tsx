
import React from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import MediaLibraryPage from '../pages/MediaLibraryPage';
import SheetMusicPage from '../pages/SheetMusicPage';
import PDFViewerPage from '../pages/PDFViewerPage';
import RecordingsPage from '../pages/RecordingsPage';
import RecordingStudioPage from '../pages/recordings/RecordingStudioPage';
import CalendarPage from '../pages/dashboard/calendar';
import CalendarDashboard from '../pages/dashboard/CalendarDashboard';
import MemberDashboardPage from '../pages/dashboard/MemberDashboardPage';
import FanDashboardPage from '../pages/FanDashboardPage';
import AnnouncementsPage from '../pages/dashboard/AnnouncementsPage';
import ArchivesPage from '../pages/dashboard/ArchivesPage';
import AttendancePage from '../pages/dashboard/AttendancePage';
import AudioManagementPage from '../pages/audio-management/AudioManagementPage';
import DashboardLayout from '../layouts/DashboardLayout';

// Define routes without duplicating wrapper components
export const dashboardRoutes = {
  path: 'dashboard',
  element: <RequireAuth><DashboardLayout /></RequireAuth>,
  children: [
    {
      path: '',
      element: <DashboardPage />,
    },
    {
      path: 'member',
      element: <MemberDashboardPage />,
    },
    {
      path: 'fan',
      element: <FanDashboardPage />,
    },
    {
      path: 'profile',
      element: <ProfilePage />,
    },
    {
      path: 'media-library',
      element: <MediaLibraryPage />,
    },
    {
      path: 'sheet-music',
      element: <SheetMusicPage />,
    },
    {
      path: 'sheet-music/:id',
      element: <PDFViewerPage />,
    },
    {
      path: 'media/pdf/:id',
      element: <PDFViewerPage />,
    },
    {
      path: 'recordings',
      element: <RecordingsPage />,
    },
    {
      path: 'recording-studio',
      element: <RecordingStudioPage />,
    },
    {
      path: 'audio-management',
      element: <AudioManagementPage />,
    },
    {
      path: 'calendar',
      element: <CalendarDashboard />,
    },
    {
      path: 'announcements',
      element: <AnnouncementsPage />,
    },
    {
      path: 'archives',
      element: <ArchivesPage />,
    },
    {
      path: 'attendance',
      element: <AttendancePage />,
    },
  ],
};
