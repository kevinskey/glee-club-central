import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import EditUserPage from "./pages/admin/EditUserPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import AttendancePage from "./pages/attendance/AttendancePage";
import MediaLibraryPage from "./pages/media/MediaLibraryPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import NotFoundPage from "./pages/NotFoundPage";
import EventCalendar from "./pages/admin/EventCalendar";
import CalendarDashboard from "@/pages/dashboard/CalendarDashboard";

function App() {
  const { authLoading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    document.body.className = "dark"; // Force dark mode
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
        <PrivateRoute
          path="/profile"
          element={<ProfilePage />}
        />
        <PrivateRoute
          path="/schedule"
          element={<SchedulePage />}
        />
        <PrivateRoute
          path="/attendance"
          element={<AttendancePage />}
        />
        <PrivateRoute
          path="/media"
          element={<MediaLibraryPage />}
        />
        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<CalendarDashboard />} />
        </Route>
        {/* Admin routes */}
        <AdminRoute
          path="/admin"
          element={<AdminDashboard />}
        />
        <AdminRoute
          path="/admin/users"
          element={<UsersPage />}
        />
        <AdminRoute
          path="/admin/users/:id/edit"
          element={<EditUserPage />}
        />
         <AdminRoute
          path="/admin/calendar"
          element={<EventCalendar />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
