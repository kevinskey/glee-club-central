
import React, { Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import RequireAuth from '@/components/auth/RequireAuth';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { PageLoader } from '@/components/ui/page-loader';

// Member Dashboard Pages
import ProfilePage from '@/pages/profile/ProfilePage';
import MediaLibraryPage from '@/pages/MediaLibraryPage';
import SheetMusicPage from '@/pages/SheetMusicPage';
import ViewSheetMusicPage from '@/pages/sheet-music/ViewSheetMusicPage';
import PDFViewerPage from '@/pages/PDFViewerPage';
import RecordingsPage from '@/pages/RecordingsPage';
import RecordingStudioPage from '@/pages/recordings/RecordingStudioPage';
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage';
import AttendancePage from '@/pages/AttendancePage';
import AudioManagementPage from '@/pages/audio-management/AudioManagementPage';
import FinancesPage from '@/pages/dashboard/FinancesPage';
import MembersPage from '@/pages/members/MembersPage';
import FanAnalyticsPage from '@/pages/dashboard/FanAnalyticsPage';
import RoleDashboard from '@/components/auth/RoleDashboard';
import SettingsPage from '@/pages/settings/SettingsPage';

// Lazy Load Heavy Components with stable keys to prevent remounting
const MemberDashboardPage = React.lazy(() => import('@/pages/dashboard/MemberDashboardPage'));
const FanDashboardPage = React.lazy(() => import('@/pages/FanDashboardPage'));

// Consistent fallback component that matches layout styling
const DashboardPageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-background">
    <PageLoader message="Loading dashboard..." size="lg" />
  </div>
);

export const memberRoutes: RouteObject[] = [
  // Role-based dashboard redirection
  {
    path: '/role-dashboard',
    element: <RequireAuth><RoleDashboard /></RequireAuth>,
  },
  // Settings Route - Dynamic sidebar based on user role
  {
    path: '/settings',
    element: <RequireAuth><AppLayout showHeader={true} showFooter={false} /></RequireAuth>,
    children: [
      { index: true, element: <SettingsPage /> },
    ],
  },
  // Profile Route
  {
    path: '/profile',
    element: <RequireAuth><AppLayout sidebarType="member" showHeader={true} showFooter={false} /></RequireAuth>,
    children: [
      { index: true, element: <ProfilePage /> },
    ],
  },
  // Member Dashboard Routes
  {
    path: '/dashboard',
    element: <RequireAuth><AppLayout sidebarType="member" showHeader={true} showFooter={false} /></RequireAuth>,
    children: [
      { index: true, element: <Navigate to="/dashboard/member" replace /> },
      { 
        path: 'member', 
        element: (
          <Suspense fallback={<DashboardPageLoader />} key="member-dashboard">
            <MemberDashboardPage />
          </Suspense>
        )
      },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'media-library', element: <MediaLibraryPage /> },
      { path: 'sheet-music', element: <SheetMusicPage /> },
      { path: 'sheet-music/:id', element: <ViewSheetMusicPage /> },
      { path: 'media/pdf/:id', element: <PDFViewerPage /> },
      { path: 'recordings', element: <RecordingsPage /> },
      { path: 'recording-studio', element: <RecordingStudioPage /> },
      { path: 'audio-management', element: <AudioManagementPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'finances', element: <FinancesPage /> },
      // Admin-only route for viewing all members - protected by AdminRoute
      { path: 'members', element: <AdminRoute><MembersPage /></AdminRoute> },
      { path: 'fan-analytics', element: <AdminRoute><FanAnalyticsPage /></AdminRoute> },
    ],
  },
  // PDF Viewer Routes
  {
    path: '/dashboard/sheet-music/view',
    element: <RequireAuth><AppLayout sidebarType="none" showHeader={true} showFooter={false} /></RequireAuth>,
    children: [
      { path: ':id', element: <ViewSheetMusicPage /> },
    ],
  },
  // Fan Dashboard Routes - using 'fan' sidebar type for different navigation
  {
    path: '/fan-dashboard',
    element: <RequireAuth><AppLayout sidebarType="fan" showHeader={true} showFooter={false} /></RequireAuth>,
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<DashboardPageLoader />} key="fan-dashboard">
            <FanDashboardPage />
          </Suspense>
        )
      },
    ],
  },
];
