
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import CalendarPage from "@/pages/CalendarPage";
import DashboardCalendarPage from "@/pages/dashboard/calendar/index";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomeLayout from "@/layouts/HomeLayout";
import RequireAuth from "@/components/auth/RequireAuth";  // Fixed: import as default export

// Add other imports as needed

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      // Add other public routes as needed
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/home" replace />,
      },
      {
        path: "calendar",
        element: <DashboardCalendarPage />,
      },
      // Add other dashboard routes
    ],
  },
  // Add other route configurations as needed
]);
