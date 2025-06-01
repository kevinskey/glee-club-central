
import { createBrowserRouter } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { RolePermissionProvider } from "@/contexts/RolePermissionContext";
import SimpleRequireAuth from "@/components/auth/SimpleRequireAuth";
import HomePage from "./pages/HomePage";
import SimpleLoginPage from "./pages/auth/SimpleLoginPage";
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
    element: <SimpleLoginPage />,
  },
  {
    path: "/role-dashboard",
    element: (
      <SimpleRequireAuth>
        <RoleDashboardPage />
      </SimpleRequireAuth>
    ),
  },
  {
    path: "/dashboard/admin",
    element: (
      <SimpleRequireAuth requireAdmin>
        <AdminDashboardPage />
      </SimpleRequireAuth>
    ),
  },
  {
    path: "/dashboard/member",
    element: (
      <SimpleRequireAuth>
        <MemberDashboardPage />
      </SimpleRequireAuth>
    ),
  },
]);
