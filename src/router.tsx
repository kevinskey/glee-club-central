
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
import PDFViewerLayout from './layouts/PDFViewerLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberDashboardPage from './pages/dashboard/MemberDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SheetMusicPage from './pages/SheetMusicPage';
import ViewSheetMusicPage from './pages/sheet-music/ViewSheetMusicPage';
import PDFViewerPage from './pages/PDFViewerPage';
import RecordingsPage from './pages/RecordingsPage';
import RecordingStudioPage from './pages/recordings/RecordingStudioPage';
import AnnouncementsPage from './pages/dashboard/AnnouncementsPage';
import ArchivesPage from './pages/dashboard/ArchivesPage';
import AttendancePage from './pages/dashboard/AttendancePage';
import AudioManagementPage from './pages/audio-management/AudioManagementPage';
import MembersPage from './pages/members/MembersPage';
import SettingsPage from './pages/settings/SettingsPage';
import FinancesPage from './pages/dashboard/FinancesPage';
import CalendarPage from './pages/CalendarPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import { AdminRoute } from './components/auth/AdminRoute';

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
      // Public calendar route
      {
        path: '/calendar',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <CalendarPage />,
          },
        ],
      },
      // Role-based dashboard redirection for authenticated users
      {
        path: '/role-dashboard',
        element: <RequireAuth><RoleDashboard /></RequireAuth>,
      },
      // Member Dashboard routes with DashboardLayout
      {
        path: '/dashboard',
        element: <RequireAuth><DashboardLayout /></RequireAuth>,
        children: [
          {
            index: true,
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
            element: <ViewSheetMusicPage />,
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
            path: 'finances',
            element: <FinancesPage />,
          },
          {
            path: 'members',
            element: <AdminRoute><MembersPage /></AdminRoute>,
          },
        ],
      },
      // Dedicated PDF Viewer routes with no sidebar (PDFViewerLayout)
      {
        path: '/dashboard/sheet-music/view',
        element: <RequireAuth><PDFViewerLayout /></RequireAuth>,
        children: [
          {
            path: ':id',
            element: <ViewSheetMusicPage />,
          },
        ],
      },
      // Admin Dashboard routes with AdminLayout (completely separate)
      {
        path: '/admin',
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'calendar',
            element: <AdminCalendarPage />,
          },
          {
            path: 'events/:id',
            element: <EventDetailsPage />,
          },
          {
            path: 'members',
            element: <MembersPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
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
