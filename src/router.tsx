
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AdminRoute from "@/components/auth/AdminRoute";
import AppLayout from "@/layouts/AppLayout";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CalendarPage from "./pages/CalendarPage";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import JoinGleeFamPage from "./pages/JoinGleeFamPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import AdminHeroManager from "./pages/admin/AdminHeroManager";
import UserManagementPage from "./pages/admin/UserManagementPage";
import UserSystemResetPage from "./pages/admin/UserSystemResetPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";
import FanDashboardPage from "./pages/dashboard/FanDashboardPage";
import ProfilePageFixed from "./pages/profile/ProfilePageFixed";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={true} showFooter={true} />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "store", element: <StorePage /> },
    ],
  },
  // Auth routes
  {
    path: "/login",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <LoginPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/signup", 
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <SignupPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <ForgotPasswordPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <ResetPasswordPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/update-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <ResetPasswordPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <RegisterPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/join-glee-fam",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <JoinGleeFamPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  // Profile route
  {
    path: "/profile",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            <ProfilePageFixed />
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Main dashboard route - handles role-based redirection
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <RequireAuth>
          <RoleDashboardPage />
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Legacy route redirect - redirect /role-dashboard to /dashboard
  {
    path: "/role-dashboard",
    element: (
      <AuthProvider>
        <RequireAuth>
          <RoleDashboardPage />
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Admin routes
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminRoute>
          <AppLayout sidebarType="admin" showHeader={false} showFooter={false} />
        </AdminRoute>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "calendar", element: <AdminCalendarPage /> },
      { path: "hero-manager", element: <AdminHeroManager /> },
      { path: "members", element: <UserManagementPage /> },
      { path: "system-reset", element: <UserSystemResetPage /> },
    ],
  },
  // Member dashboard
  {
    path: "/dashboard/member",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            <MemberDashboardPage />
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Fan dashboard
  {
    path: "/dashboard/fan",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
            <FanDashboardPage />
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
