
import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import CalendarPage from "@/pages/CalendarPage";
import AdminLayout from "@/layouts/AdminLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireAdmin from "@/components/auth/RequireAdmin";
import React from "react";
import EventsListPage from "@/pages/events/EventsListPage";
import CreateEventPage from "@/pages/events/CreateEventPage";
import EditEventPage from "@/pages/events/EditEventPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import EventManagerPage from "@/pages/admin/EventManagerPage";
import EventCalendar from "@/pages/admin/EventCalendar";
import { useAuth } from "@/contexts/AuthContext";

const router = createBrowserRouter([
  {
    id: "main",
    path: "/",
    element: <div className="main-layout"><Outlet /></div>,
    children: [
      {
        index: true,
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
    ],
  },
  {
    id: "dashboard",
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/calendar" replace />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "events",
        element: <EventsListPage />,
      },
      {
        path: "events/create",
        element: <CreateEventPage />,
      },
      {
        path: "events/edit/:id",
        element: <EditEventPage />,
      },
    ],
  },
  {
    id: "admin",
    path: "/dashboard/admin",
    element: (
      <RequireAuth>
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/admin/events" replace />,
      },
      {
        path: "events-manager",
        element: <EventManagerPage />,
      },
      {
        path: "event-calendar",
        element: <EventCalendar />,
      },
      {
        path: "events",
        element: <EventsListPage />,
      },
      {
        path: "events/create",
        element: <CreateEventPage />,
      },
      {
        path: "events/edit/:id",
        element: <EditEventPage />,
      },
    ],
  },
]);

// Add import for Outlet
import { Outlet } from "react-router-dom";

// Export as default instead of named export
export default router;
