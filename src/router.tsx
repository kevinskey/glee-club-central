
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Import pages that exist
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import MembersPage from "./pages/MembersPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";

// Import layout components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminRoute } from "./components/auth/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/update-password",
    element: <ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>,
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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "members",
        element: <AdminRoute><MembersPage /></AdminRoute>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
