import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";

// Unified Layout
import AppLayout from './layouts/AppLayout';

// Auth Components
import RequireAuth from './components/auth/RequireAuth';
import { AdminRoute } from './components/auth/AdminRoute';
import RoleDashboard from './components/auth/RoleDashboard';

// Loading Component
import { PageLoader } from './components/ui/page-loader';

// Public Pages (keep as regular imports for faster initial load)
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PublicEventsPage from './pages/PublicEventsPage';
import CalendarPage from './pages/CalendarPage';
import JoinGleeFamPage from './pages/JoinGleeFamPage';
import StorePage from './pages/StorePage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelledPage from './pages/CheckoutCancelledPage';

// Auth Pages (keep as regular imports)
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Regular Dashboard Pages (lighter components)
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
import FinancesPage from './pages/dashboard/FinancesPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import MembersPage from './pages/members/MembersPage';
import SettingsPage from './pages/settings/SettingsPage';
import FanAnalyticsPage from './pages/dashboard/FanAnalyticsPage';
import OrdersPage from './pages/admin/OrdersPage';

// Lazy Load Heavy/Admin Pages
const MemberDashboardPage = React.lazy(() => import('./pages/dashboard/MemberDashboardPage'));
const FanDashboardPage = React.lazy(() => import('./pages/FanDashboardPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminMediaUploaderPage = React.lazy(() => import('./pages/admin/AdminMediaUploaderPage'));
const AdminHeroManager = React.lazy(() => import('./pages/admin/AdminHeroManager'));
const UserManagementPage = React.lazy(() => import('./pages/admin/UserManagementPage'));
const EventDetailsPage = React.lazy(() => import('./pages/events/EventDetailsPage'));

export const router = createBrowserRouter([
  {
    // Root element with error boundary
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
      // ==================== PUBLIC ROUTES (with landing header) ====================
      {
        path: '/',
        element: <AppLayout sidebarType="none" showHeader={true} showFooter={true} />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'events', element: <PublicEventsPage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'join-glee-fam', element: <JoinGleeFamPage /> },
          { path: 'store', element: <StorePage /> },
        ],
      },

      // ==================== CHECKOUT ROUTES ====================
      { 
        path: '/checkout-success', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><CheckoutSuccessPage /></AppLayout>
      },
      { 
        path: '/store/success', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><CheckoutSuccessPage /></AppLayout>
      },
      { 
        path: '/store/cancelled', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><CheckoutCancelledPage /></AppLayout>
      },

      // ==================== AUTHENTICATION ROUTES ====================
      { 
        path: '/login', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><LoginPage /></AppLayout>
      },
      { 
        path: '/signup', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><SignupPage /></AppLayout>
      },
      { 
        path: '/register', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><AdminRegistrationPage /></AppLayout>
      },
      { 
        path: '/forgot-password', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ForgotPasswordPage /></AppLayout>
      },
      { 
        path: '/reset-password', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ResetPasswordPage /></AppLayout>
      },
      { 
        path: '/update-password', 
        element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ResetPasswordPage /></AppLayout>
      },

      // Role-based dashboard redirection
      {
        path: '/role-dashboard',
        element: <RequireAuth><RoleDashboard /></RequireAuth>,
      },

      // ==================== PROFILE ROUTE ====================
      {
        path: '/profile',
        element: <RequireAuth><AppLayout sidebarType="member" showHeader={true} showFooter={false} /></RequireAuth>,
        children: [
          { index: true, element: <ProfilePage /> },
        ],
      },

      // ==================== MEMBER DASHBOARD ROUTES ====================
      {
        path: '/dashboard',
        element: <RequireAuth><AppLayout sidebarType="member" showHeader={true} showFooter={false} /></RequireAuth>,
        children: [
          { index: true, element: <Navigate to="/dashboard/member" replace /> },
          { 
            path: 'member', 
            element: (
              <Suspense fallback={<PageLoader />}>
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
          { path: 'archives', element: <ArchivesPage /> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'finances', element: <FinancesPage /> },
          { path: 'members', element: <AdminRoute><MembersPage /></AdminRoute> },
          { path: 'fan', element: <AdminRoute><FanAnalyticsPage /></AdminRoute> },
        ],
      },

      // ==================== PDF VIEWER ROUTES ====================
      {
        path: '/dashboard/sheet-music/view',
        element: <RequireAuth><AppLayout sidebarType="none" showHeader={true} showFooter={false} /></RequireAuth>,
        children: [
          { path: ':id', element: <ViewSheetMusicPage /> },
        ],
      },

      // ==================== ADMIN DASHBOARD ROUTES (LAZY LOADED) ====================
      {
        path: '/admin',
        element: <AdminRoute><AppLayout sidebarType="admin" showHeader={true} showFooter={false} /></AdminRoute>,
        children: [
          { 
            index: true, 
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminDashboardPage />
              </Suspense>
            )
          },
          { path: 'calendar', element: <AdminCalendarPage /> },
          { 
            path: 'events/:id', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <EventDetailsPage />
              </Suspense>
            )
          },
          { path: 'members', element: <MembersPage /> },
          { 
            path: 'user-management', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserManagementPage />
              </Suspense>
            )
          },
          { path: 'users', element: <UserManagementPage /> },
          { 
            path: 'media-uploader', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminMediaUploaderPage />
              </Suspense>
            )
          },
          { 
            path: 'hero-manager', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminHeroManager />
              </Suspense>
            )
          },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },

      // ==================== FAN DASHBOARD ROUTES (LAZY LOADED) ====================
      {
        path: '/fan-dashboard',
        element: <RequireAuth><AppLayout sidebarType="fan" showHeader={true} showFooter={false} /></RequireAuth>,
        children: [
          { 
            index: true, 
            element: (
              <Suspense fallback={<PageLoader />}>
                <FanDashboardPage />
              </Suspense>
            )
          },
        ],
      },
    ],
  },
]);

export default router;
