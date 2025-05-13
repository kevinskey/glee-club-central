import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/profile/ProfilePage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CalendarPage from './pages/CalendarPage';
import MembersPage from './pages/members/MembersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AttendancePage from './pages/AttendancePage';
import SheetMusicPage from './pages/sheet-music/SheetMusicPage';
import HomeLayout from './layouts/HomeLayout';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import MemberProfile from './pages/members/MemberProfile';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import NotFoundPage from './pages/NotFoundPage';
import PracticeLogsPage from './pages/practice-logs/PracticeLogsPage';
import RecordingsPage from './pages/recordings/RecordingsPage';
import PerformancesPage from './pages/PerformancesPage';
import UserSetupPage from './pages/auth/UserSetupPage';
import SetlistsPage from './pages/setlists/SetlistsPage';

// Lazy loaded components
const ContactPage = lazy(() => import('./pages/ContactPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<>Loading...</>}>
            <ContactPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'signup',
        element: <SignupPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      },
      {
        path: 'setup',
        element: <UserSetupPage />
      }
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: 'attendance',
        element: <AttendancePage />
      },
      {
        path: 'sheet-music',
        element: <SheetMusicPage />
      },
      {
        path: 'setlists',
        element: <SetlistsPage />
      },
      {
        path: 'recordings',
        element: <RecordingsPage />
      },
      {
        path: 'members',
        element: <MembersPage />
      },
      {
        path: 'members/:id',
        element: <MemberProfile />
      },
      {
        path: 'performances',
        element: <PerformancesPage />
      },
      {
        path: 'announcements',
        element: <AnnouncementsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'resources',
        element: <ResourcesPage />
      },
      {
        path: 'practice-logs',
        element: <PracticeLogsPage />
      },
      {
        path: 'admin',
        element: <AdminDashboard />
      },
      {
        path: 'update-password',
        element: <UpdatePasswordPage />
      }
      // Removed handbook and PDF viewer routes
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
