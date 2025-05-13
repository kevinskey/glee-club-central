import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/profile/ProfilePage'; // Make sure we use the correct ProfilePage
import CalendarPage from './pages/CalendarPage';
import MembersPage from './pages/MembersPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import MediaPage from './pages/MediaPage';
import WardrobePage from './pages/WardrobePage';
import FinancePage from './pages/FinancePage';
import AttendancePage from './pages/AttendancePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <DashboardPage />
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
            path: 'members',
            element: <MembersPage />
          },
          {
            path: 'media',
            element: <MediaPage />
          },
           {
            path: 'wardrobe',
            element: <WardrobePage />
          },
          {
            path: 'finance',
            element: <FinancePage />
          },
          {
            path: 'attendance',
            element: <AttendancePage />
          },
        ]
      },
      {
        path: 'admin',
        element: <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
]);

export default router;
