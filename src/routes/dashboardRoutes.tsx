
import React from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import ProfilePage from '../pages/profile/ProfilePage';
import MediaLibraryPage from '../pages/MediaLibraryPage';
import SheetMusicPage from '../pages/SheetMusicPage';
import PDFViewerPage from '../pages/PDFViewerPage';
import RecordingsPage from '../pages/RecordingsPage';
import RecordingStudioPage from '../pages/recordings/RecordingStudioPage';
import MemberDashboardPage from '../pages/dashboard/MemberDashboardPage';
import AnnouncementsPage from '../pages/dashboard/AnnouncementsPage';
import ArchivesPage from '../pages/dashboard/ArchivesPage';
import AttendancePage from '../pages/dashboard/AttendancePage';
import AudioManagementPage from '../pages/audio-management/AudioManagementPage';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import MembersPage from '../pages/members/MembersPage';
import SettingsPage from '../pages/settings/SettingsPage';
import FinancesPage from '../pages/dashboard/FinancesPage';
import { Navigate } from 'react-router-dom';

// Define routes without duplicating wrapper components
export const dashboardRoutes = {
  path: 'dashboard',
  element: <RequireAuth><DashboardLayout /></RequireAuth>,
  children: [
    {
      path: '',
      element: <Navigate to="/dashboard/member" replace />,
    },
    {
      path: 'member',
      element: <MemberDashboardPage />,
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
    // Admin routes within dashboard
    {
      path: 'admin',
      element: <RequireAuth requireAdmin={true}><AdminDashboardPage /></RequireAuth>,
    },
    {
      path: 'admin/members',
      element: <RequireAuth requireAdmin={true}><MembersPage /></RequireAuth>,
    },
    {
      path: 'admin/settings',
      element: <RequireAuth requireAdmin={true}><SettingsPage /></RequireAuth>,
    },
    {
      path: 'finances',
      element: <FinancesPage />,
    },
  ],
};
