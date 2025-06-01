
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AppLayout from "@/layouts/AppLayout";

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
  // Public routes - wrapped with AuthProvider
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
      { path: "calendar", element: <EnhancedCalendarPage /> },
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
    path: "/register",
    element: (
      <AuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <RegisterPage />
        </AppLayout>
      </AuthProvider>
    ),
  },
  // Protected routes
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
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <RequireAuth requireAdmin>
          <AdminDashboardPage />
        </RequireAuth>
      </AuthProvider>
    ),
  },
  {
    path: "/dashboard/member",
    element: (
      <AuthProvider>
        <RequireAuth>
          <MemberDashboardPage />
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
