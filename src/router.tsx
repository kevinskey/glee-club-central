
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
import AdminDashboard from './pages/admin/AdminDashboard';
import PressKitPage from './pages/PressKitPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import YoutubeVideosPage from './pages/YoutubeVideosPage';
import SiteImagesPage from './pages/admin/SiteImagesPage';
import SocialPage from './pages/SocialPage';

// Import auth related pages
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

// Import admin pages
import AdminLayout from './layouts/AdminLayout';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UsersPage from './pages/admin/UsersPage';
import EventCalendar from './pages/admin/EventCalendar';
import MediaLibrary from './pages/admin/MediaLibrary';
import SettingsPage from './pages/admin/SettingsPage';
import LandingPageSettingsPage from './pages/admin/LandingPageSettingsPage';

// Shared components
import { AdminRoute } from './components/auth/AdminRoute';

// Protected route components
import RequireAdmin from './components/auth/RequireAdmin';

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
        path: 'youtube-videos',
        element: <YoutubeVideosPage />,
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
        path: 'calendar',
        element: <EventCalendar />
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
