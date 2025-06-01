
import { createBrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import SimpleRequireAuth from "@/components/auth/SimpleRequireAuth";
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
  // Public routes - no auth context needed for public pages
  {
    path: "/",
    element: <AppLayout sidebarType="none" showHeader={true} showFooter={true} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "calendar", element: <EnhancedCalendarPage /> },
      { path: "store", element: <StorePage /> },
    ],
  },
  // Auth routes - wrapped with SimpleAuthProvider
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
  // Role dashboard - determines redirect based on user role
  {
    path: "/role-dashboard",
    element: (
      <SimpleAuthProvider>
        <SimpleRequireAuth>
          <RoleDashboardPage />
        </SimpleRequireAuth>
      </SimpleAuthProvider>
    ),
  },
  // Admin dashboard - fixed path to match RoleDashboardPage redirect
  {
    path: "/dashboard/admin",
    element: (
      <SimpleAuthProvider>
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      </SimpleAuthProvider>
    ),
  },
  // Member dashboard
  {
    path: "/dashboard/member",
    element: (
      <SimpleAuthProvider>
        <SimpleRequireAuth>
          <MemberDashboardPage />
        </SimpleRequireAuth>
      </SimpleAuthProvider>
    ),
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
