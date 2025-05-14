import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/ProfilePage';
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
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';

// Import admin pages
import { AdminRoute } from './components/auth/AdminRoute';

// Import dashboard calendar page
import CalendarPage from './pages/dashboard/calendar/index';

// Lazy-loaded components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </Suspense>
        ),
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
        path: 'recordings',
        element: <RecordingsPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
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
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
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
]);
