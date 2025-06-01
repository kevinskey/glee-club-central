
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
import JoinGleeFamPage from "./pages/JoinGleeFamPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCalendarPage from "./pages/admin/AdminCalendarPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";
import FanDashboardPage from "./pages/dashboard/FanDashboardPage";
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
  {
    path: "/join-glee-fam",
    element: (
      <SimpleAuthProvider>
        <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
          <JoinGleeFamPage />
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
  // Admin routes - updated to include calendar and other admin pages
  {
    path: "/admin",
    element: (
      <SimpleAuthProvider>
        <AdminRoute>
          <AppLayout sidebarType="admin" showHeader={false} showFooter={false} />
        </AdminRoute>
      </SimpleAuthProvider>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "calendar", element: <AdminCalendarPage /> },
    ],
  },
  // Member dashboard
  {
    path: "/dashboard/member",
    element: (
      <SimpleAuthProvider>
        <SimpleRequireAuth>
          <AppLayout sidebarType="member" showHeader={false} showFooter={false}>
            <MemberDashboardPage />
          </AppLayout>
        </SimpleRequireAuth>
      </SimpleAuthProvider>
    ),
  },
  // Fan dashboard
  {
    path: "/dashboard/fan",
    element: (
      <SimpleAuthProvider>
        <SimpleRequireAuth>
          <AppLayout sidebarType="none" showHeader={false} showFooter={false}>
            <FanDashboardPage />
          </AppLayout>
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
