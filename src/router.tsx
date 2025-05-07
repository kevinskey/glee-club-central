
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AdminUserManagementPage from "@/pages/AdminUserManagementPage";
import MemberProfilePage from "@/pages/profile/MemberProfilePage";
import MemberEditPage from "@/pages/MemberEditPage";
import EditMemberPage from "@/pages/EditMemberPage";

// Create a placeholder for UpdatePasswordPage
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/update-password",
    element: <UpdatePasswordPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "member-management",
        element: <AdminUserManagementPage />,
      },
      {
        path: "profile",
        element: <MemberProfilePage />,
      },
      {
        path: "profile/:id",
        element: <MemberProfilePage />,
      },
      {
        path: "profile/edit/:id",
        element: <MemberEditPage />,
      },
      {
        path: "members/edit/:id",
        element: <EditMemberPage />,
      },
      {
        path: "members/:id",
        element: <MemberProfilePage />,
      },
    ],
  },
]);

export default router;
