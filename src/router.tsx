
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EnhancedCalendarPage from "./pages/EnhancedCalendarPage";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <AppLayout sidebarType="none" showHeader={true} showFooter={true} />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "calendar", element: <EnhancedCalendarPage /> },
      { path: "store", element: <StorePage /> },
    ],
  },
  // Auth routes
  {
    path: "/login",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><LoginPage /></AppLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup", 
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><SignupPage /></AppLayout>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><RegisterPage /></AppLayout>,
    errorElement: <ErrorBoundary />,
  },
  // Protected routes
  {
    path: "/role-dashboard",
    element: (
      <RequireAuth>
        <RoleDashboardPage />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    element: (
      <RequireAuth requireAdmin>
        <AdminDashboardPage />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard/member",
    element: (
      <RequireAuth>
        <MemberDashboardPage />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
