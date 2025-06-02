import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AdminRoute from "@/components/auth/AdminRoute";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CalendarPage from "./pages/CalendarPage";
import StorePage from "./pages/StorePage";
import NewsArticlePage from "./pages/news/NewsArticlePage";
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
import AdminMediaLibraryPage from "./pages/admin/AdminMediaLibraryPage";
import AdminMediaUploaderPage from "./pages/admin/AdminMediaUploaderPage";
import NewsTickerSettingsPage from "./pages/admin/NewsTickerSettingsPage";
import AdminModularHeroPage from "./pages/admin/AdminModularHeroPage";
import AnnouncementsPage from "./pages/announcements/AnnouncementsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import EventRSVPsPage from "./pages/admin/EventRSVPsPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";
import FanDashboardPage from "./pages/dashboard/FanDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Error boundary wrapper for critical routes
const withErrorBoundary = (element: React.ReactElement) => (
  <ErrorBoundary>{element}</ErrorBoundary>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={true} showFooter={true} />
      </AuthProvider>
    ),
    errorElement: withErrorBoundary(<NotFoundPage />),
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "store", element: <StorePage /> },
      { path: "news/:id", element: <NewsArticlePage /> },
    ],
  },
  // Auth routes with error boundaries
  {
    path: "/login",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<LoginPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<SignupPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<ForgotPasswordPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<ResetPasswordPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/update-password",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<ResetPasswordPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<RegisterPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  {
    path: "/join-glee-fam",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          {withErrorBoundary(<JoinGleeFamPage />)}
        </AppLayout>
      </AuthProvider>
    ),
  },
  // Protected routes with error boundaries
  {
    path: "/profile",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            {withErrorBoundary(<ProfilePage />)}
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Dashboard routing - main entry point for role-based redirection
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <RequireAuth>
          {withErrorBoundary(<RoleDashboardPage />)}
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // Admin routes with error boundaries
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminRoute>
          <AppLayout sidebarType="admin" showHeader={false} showFooter={false} />
        </AdminRoute>
      </AuthProvider>
    ),
    errorElement: withErrorBoundary(<NotFoundPage />),
    children: [
      { index: true, element: withErrorBoundary(<AdminDashboardPage />) },
      { path: "calendar", element: withErrorBoundary(<AdminCalendarPage />) },
      { path: "events/:id", element: withErrorBoundary(<EventDetailsPage />) },
      { path: "events/:id/rsvps", element: withErrorBoundary(<EventRSVPsPage />) },
      { path: "members", element: withErrorBoundary(<UserManagementPage />) },
      { path: "hero-manager", element: withErrorBoundary(<AdminHeroManager />) },
      { path: "modular-hero", element: withErrorBoundary(<AdminModularHeroPage />) },
      { path: "media", element: withErrorBoundary(<AdminMediaLibraryPage />) },
      { path: "media-uploader", element: withErrorBoundary(<AdminMediaUploaderPage />) },
      { path: "news-ticker", element: withErrorBoundary(<NewsTickerSettingsPage />) },
      { path: "orders", element: withErrorBoundary(<OrdersPage />) },
      { path: "analytics", element: withErrorBoundary(<AnalyticsPage />) },
      { path: "announcements", element: withErrorBoundary(<AnnouncementsPage />) },
      { path: "settings", element: withErrorBoundary(<SettingsPage />) },
      { path: "system-reset", element: withErrorBoundary(<UserSystemResetPage />) },
    ],
  },
  // Specific dashboard routes with error boundaries
  {
    path: "/dashboard/member",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            {withErrorBoundary(<MemberDashboardPage />)}
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  {
    path: "/dashboard/fan",
    element: (
      <AuthProvider>
        <RequireAuth>
          <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
            {withErrorBoundary(<FanDashboardPage />)}
          </AppLayout>
        </RequireAuth>
      </AuthProvider>
    ),
  },
  // 404 route
  {
    path: "*",
    element: withErrorBoundary(<NotFoundPage />),
  },
]);
