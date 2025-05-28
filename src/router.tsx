
import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";
import StaticLandingPage from './pages/StaticLandingPage';
import HomeTemp from './pages/HomeTemp';
import { authRoutes } from './routes/authRoutes';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import HomeLayout from './layouts/HomeLayout';
import RequireAuth from './components/auth/RequireAuth';
import RoleDashboard from './components/auth/RoleDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import MemberDashboardPage from './pages/dashboard/MemberDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SheetMusicPage from './pages/SheetMusicPage';
import PDFViewerPage from './pages/PDFViewerPage';
import RecordingsPage from './pages/RecordingsPage';
import RecordingStudioPage from './pages/recordings/RecordingStudioPage';
import AnnouncementsPage from './pages/dashboard/AnnouncementsPage';
import ArchivesPage from './pages/dashboard/ArchivesPage';
import AttendancePage from './pages/dashboard/AttendancePage';
import AudioManagementPage from './pages/audio-management/AudioManagementPage';
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import MembersPage from './pages/members/MembersPage';
import SettingsPage from './pages/settings/SettingsPage';
import FinancesPage from './pages/dashboard/FinancesPage';

// Create a properly structured router with all routes
export const router = createBrowserRouter([
  {
    // Root element that wraps the outlet component
    element: <Outlet />,
    errorElement: (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full p-6 bg-background border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-glee-purple mb-4">Navigation Error</h1>
            <p className="text-muted-foreground mb-4">
              An error occurred while trying to navigate to the requested page.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-glee-spelman text-white rounded hover:bg-glee-spelman/90"
            >
              Return to Home
            </button>
          </div>
        </div>
      </ErrorBoundary>
    ),
    children: [
      // Public routes with HomeLayout for the home page
      {
        path: '/',
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </React.Suspense>
            ),
          },
        ],
      },
      // Role-based dashboard redirection for authenticated users
      {
        path: '/role-dashboard',
        element: <RequireAuth><RoleDashboard /></RequireAuth>,
      },
      // Dashboard routes with proper authentication
      {
        path: '/dashboard',
        element: <RequireAuth><DashboardLayout /></RequireAuth>,
        children: [
          {
            index: true,
            element: <DashboardPage />,
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
          {
            path: 'admin',
            element: <RequireAuth requireAdmin={true}><AdminDashboardPage /></RequireAuth>,
          },
          {
            path: 'admin/members',
            element: <RequireAuth requireAdmin={true}><MembersPage /></RequireAuth>,
          },
          {
            path: 'finances',
            element: <RequireAuth requireAdmin={true}><FinancesPage /></RequireAuth>,
          },
          {
            path: 'settings',
            element: <RequireAuth requireAdmin={true}><SettingsPage /></RequireAuth>,
          },
        ],
      },
      // Secondary routes with MainLayout
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: 'home-temp',
            element: <HomeTemp />,
          },
          {
            path: 'under-construction',
            element: <StaticLandingPage />,
          },
          // Add About and Contact routes
          {
            path: 'about',
            element: <AboutPage />,
          },
          {
            path: 'contact',
            element: <ContactPage />,
          },
        ],
      },
      // Auth routes
      ...authRoutes,
    ],
  },
]);

export default router;
