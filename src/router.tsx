
import { createBrowserRouter } from "react-router-dom";
import { SimpleAuthProviderFixed } from "@/contexts/SimpleAuthContextFixed";
import SimpleRequireAuth from "@/components/auth/SimpleRequireAuth";
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
  // Public routes - now wrapped with auth context for header functionality
  {
    path: "/",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={true} showFooter={true} />
      </SimpleAuthProviderFixed>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "store", element: <StorePage /> },
    ],
  },
  // Auth routes - wrapped with SimpleAuthProviderFixed
  {
    path: "/login",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <LoginPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/signup", 
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <SignupPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <ForgotPasswordPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false">
          <ResetPasswordPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/update-password",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <ResetPasswordPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/register",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <RegisterPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  {
    path: "/join-glee-fam",
    element: (
      <SimpleAuthProviderFixed>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <JoinGleeFamPage />
        </AppLayout>
      </SimpleAuthProviderFixed>
    ),
  },
  // Profile route - standalone profile page with fixed auth
  {
    path: "/profile",
    element: (
      <SimpleAuthProviderFixed>
        <SimpleRequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            <ProfilePageFixed />
          </AppLayout>
        </SimpleRequireAuth>
      </SimpleAuthProviderFixed>
    ),
  },
  // Role dashboard - determines redirect based on user role
  {
    path: "/role-dashboard",
    element: (
      <SimpleAuthProviderFixed>
        <SimpleRequireAuth>
          <RoleDashboardPage />
        </SimpleRequireAuth>
      </SimpleAuthProviderFixed>
    ),
  },
  // Admin routes - updated to include all admin pages including members and system reset
  {
    path: "/admin",
    element: (
      <SimpleAuthProviderFixed>
        <AdminRoute>
          <AppLayout sidebarType="admin" showHeader={false} showFooter={false} />
        </AdminRoute>
      </SimpleAuthProviderFixed>
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
      <SimpleAuthProviderFixed>
        <SimpleRequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            <MemberDashboardPage />
          </AppLayout>
        </SimpleRequireAuth>
      </SimpleAuthProviderFixed>
    ),
  },
  // Fan dashboard
  {
    path: "/dashboard/fan",
    element: (
      <SimpleAuthProviderFixed>
        <SimpleRequireAuth>
          <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
            <FanDashboardPage />
          </AppLayout>
        </SimpleRequireAuth>
      </SimpleAuthProviderFixed>
    ),
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
