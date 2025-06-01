
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/role-dashboard",
    element: (
      <RequireAuth>
        <RoleDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/dashboard/admin",
    element: (
      <RequireAuth requireAdmin>
        <AdminDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/dashboard/member",
    element: (
      <RequireAuth>
        <MemberDashboardPage />
      </RequireAuth>
    ),
  },
]);
