
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import App from './App';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/profile/ProfilePage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import NotFoundPage from './pages/NotFoundPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SheetMusicPage from './pages/SheetMusicPage';
import RecordingsPage from './pages/recordings/RecordingsPage';
import PressKitPage from './pages/PressKitPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SocialPage from './pages/SocialPage';
import PDFViewerPage from './pages/PDFViewerPage';
import ViewSheetMusicPage from './pages/sheet-music/ViewSheetMusicPage';
import FanPage from './pages/FanPage';

// Admin components
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SiteImagesPage from './pages/admin/SiteImagesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UsersPage from './pages/admin/UsersPage';
import MediaLibrary from './pages/admin/MediaLibrary';
import SettingsPage from './pages/admin/SettingsPage';
import LandingPageSettingsPage from './pages/admin/LandingPageSettingsPage';

// Import auth related pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';

// Import admin pages
import { AdminRoute } from './components/auth/AdminRoute';
import RequireAuth from './components/auth/RequireAuth';

// Import dashboard calendar page
import CalendarPage from './pages/dashboard/calendar';

// Import dashboard pages for different user types
import MemberDashboardPage from './pages/dashboard/MemberDashboardPage';
import FanDashboardPage from './pages/dashboard/FanDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Add the RoleDashboard component to route users based on their role
import RoleDashboard from './components/auth/RoleDashboard';
import AdministrationPage from './pages/AdministrationPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />, // Ensuring LandingPage is used for the root route
          },
          {
            path: 'about',
            element: <AboutPage />,
          },
          {
            path: 'contact',
            element: <ContactPage />,
          },
          {
            path: 'announcements',
            element: <AnnouncementsPage />,
          },
          {
            path: 'press-kit',
            element: <PressKitPage />,
          },
          {
            path: 'privacy',
            element: <PrivacyPolicyPage />,
          },
          {
            path: 'terms',
            element: <TermsOfServicePage />,
          },
          {
            path: 'social',
            element: <SocialPage />,
          },
          {
            path: 'fan',
            element: <FanPage />,
          },
          {
            path: 'administration',
            element: <AdministrationPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
      {
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
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/register',
        element: <AdminRegistrationPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/update-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/admin',
        element: (
          <RequireAuth requireAdmin={true}>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />
          },
          {
            path: 'users',
            element: <UsersPage />
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />
          },
          {
            path: 'media',
            element: <MediaLibrary />
          },
          {
            path: 'settings',
            element: <SettingsPage />
          },
          {
            path: 'landing-page',
            element: <LandingPageSettingsPage />
          },
          {
            path: 'site-images',
            element: <SiteImagesPage />
          }
        ]
      }
    ],
  },
]);

export default router;
