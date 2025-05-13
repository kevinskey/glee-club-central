
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/profile/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import MembersPage from './pages/MembersPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AttendancePage from './pages/AttendancePage';
import MediaLibraryPage from './pages/MediaLibraryPage';

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
            element: <MediaLibraryPage />
          },
          {
            path: 'attendance',
            element: <AttendancePage />
          }
        ]
      },
      {
        path: 'admin',
        element: <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    ]
  }
]);

export default router;
