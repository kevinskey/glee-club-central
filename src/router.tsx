
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Import pages that exist
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import MembersPage from "./pages/MembersPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

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
        index: true,
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
      {
        path: "admin",
        element: <AdminRoute><AdminDashboardPage /></AdminRoute>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
