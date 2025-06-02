
import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { memberRoutes } from "./routes/memberRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import AppLayout from "./layouts/AppLayout";
import AuthRoute from "./components/auth/AuthRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Additional Pages
import AutoProductGeneratorPage from "./pages/AutoProductGeneratorPage";
import DesignStudioPage from "./pages/DesignStudioPage";

const router = createBrowserRouter([
  // Public Routes
  ...publicRoutes,
  
  // Auth Routes
  {
    path: "/login",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><LoginPage /></AppLayout>,
  },
  {
    path: "/signup",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><SignupPage /></AppLayout>,
  },
  {
    path: "/forgot-password",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ForgotPasswordPage /></AppLayout>,
  },
  {
    path: "/reset-password",
    element: <AppLayout sidebarType="none" showHeader={false} showFooter={false}><ResetPasswordPage /></AppLayout>,
  },

  // Member Routes (Protected)
  {
    path: "/member",
    element: <AppLayout sidebarType="member" showHeader={true} showFooter={false} />,
    children: memberRoutes,
  },

  // Admin Routes (Protected)
  {
    path: "/admin",
    element: <AppLayout sidebarType="admin" showHeader={true} showFooter={false} />,
    children: adminRoutes,
  },

  // Design Studio Routes
  {
    path: "/design-studio",
    element: (
      <AuthRoute>
        <AppLayout sidebarType="member" showHeader={true} showFooter={false}>
          <DesignStudioPage />
        </AppLayout>
      </AuthRoute>
    ),
  },
  {
    path: "/auto-generator",
    element: (
      <AdminRoute>
        <AppLayout sidebarType="admin" showHeader={true} showFooter={false}>
          <AutoProductGeneratorPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
]);

export default router;
