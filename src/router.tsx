

import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AdminRoute from "@/components/auth/AdminRoute";
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
  // Public routes - wrapped with AuthProvider and ProfileProvider
  {
    path: "/",
    element: (
      <AuthProvider>
        <ProfileProvider>
          <AppLayout sidebarType="none" showHeader={true} showFooter={true} />
        </ProfileProvider>
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
      <SimpleAuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <LoginPage />
        </AppLayout>
      </SimpleAuthProvider>
    ),
  },
  {
    path: "/signup", 
    element: (
      <SimpleAuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <SignupPage />
        </AppLayout>
      </SimpleAuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <SimpleAuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <RegisterPage />
        </AppLayout>
      </SimpleAuthProvider>
    ),
  },
  // Protected routes - using SimpleAuthProvider for admin functionality
  {
    path: "/role-dashboard",
    element: (
      <SimpleAuthProvider>
        <RequireAuth>
          <RoleDashboardPage />
        </RequireAuth>
      </SimpleAuthProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <SimpleAuthProvider>
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      </SimpleAuthProvider>
    ),
  },
  {
    path: "/dashboard/member",
    element: (
      <SimpleAuthProvider>
        <RequireAuth>
          <MemberDashboardPage />
        </RequireAuth>
      </SimpleAuthProvider>
    ),
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

