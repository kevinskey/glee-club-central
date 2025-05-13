import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import CalendarPage from "@/pages/CalendarPage";
import AdminLayout from "@/layouts/AdminLayout";
import MediaLibraryPage from "@/pages/admin/MediaLibraryPage";
import UsersPage from "@/pages/admin/UsersPage";
import EventManagerPage from "@/pages/admin/EventManagerPage";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireAdmin from "@/components/auth/RequireAdmin";
import EventCalendar from "@/pages/admin/EventCalendar";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import SectionManagerPage from "./pages/admin/SectionManagerPage";
import EventsListPage from "./pages/events/EventsListPage";
import CreateEventPage from "./pages/events/CreateEventPage";
import EditEventPage from "./pages/events/EditEventPage";

const router = createBrowserRouter([
  {
    id: "main",
    path: "/",
    element: <MainLayout />,
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
        element: <Navigate to="/dashboard/admin/media" replace />,
      },
      {
        path: "media",
        element: <MediaLibraryPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
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
        path: "sections",
        element: <SectionManagerPage />,
      },
      // Add these routes:
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

export default router;
