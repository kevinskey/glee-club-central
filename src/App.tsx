
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/SignupPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import { EditUserDialog } from "@/components/members/EditUserDialog";
import UnauthorizedPage from "@/pages/NotFoundPage"; // Using NotFoundPage as a fallback
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import SchedulePage from "@/pages/schedule/SchedulePage";
import AttendancePage from "@/pages/dashboard/AttendancePage";
import MediaLibraryPage from "@/pages/MediaLibraryPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import EventCalendar from "@/pages/admin/EventCalendar";
import CalendarDashboard from "@/pages/dashboard/CalendarDashboard";

function App() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const authLoading = useAuth().isLoading;

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
        <Route path="/profile" element={
          isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
        }/>
        <Route path="/schedule" element={
          isAuthenticated ? <SchedulePage /> : <Navigate to="/login" />
        }/>
        <Route path="/attendance" element={
          isAuthenticated ? <AttendancePage /> : <Navigate to="/login" />
        }/>
        <Route path="/media" element={
          isAuthenticated ? <MediaLibraryPage /> : <Navigate to="/login" />
        }/>
        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<CalendarDashboard />} />
        </Route>
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/admin/users"
          element={
            isAuthenticated && isAdmin ? <UsersPage /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            isAuthenticated && isAdmin ? <EditUserDialog isOpen={true} onOpenChange={() => {}} onSave={async () => {}} isSubmitting={false} user={null} /> : <Navigate to="/unauthorized" />
          }
        />
         <Route
          path="/admin/calendar"
          element={
            isAuthenticated && isAdmin ? <EventCalendar /> : <Navigate to="/unauthorized" />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
