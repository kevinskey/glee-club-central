import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Import pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import MembersPage from "./pages/MembersPage";
import MemberDetailsPage from "./pages/MemberDetailsPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import RepertoirePage from "./pages/RepertoirePage";
import RepertoireDetailsPage from "./pages/RepertoireDetailsPage";
import AttendancePage from "./pages/AttendancePage";
import FinancesPage from "./pages/FinancesPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import ResourcesPage from "./pages/ResourcesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "members",
        element: <AdminRoute><MembersPage /></AdminRoute>,
      },
      {
        path: "members/:memberId",
        element: <AdminRoute><MemberDetailsPage /></AdminRoute>,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "events/:eventId",
        element: <EventDetailsPage />,
      },
      {
        path: "repertoire",
        element: <RepertoirePage />,
      },
      {
        path: "repertoire/:repertoireId",
        element: <RepertoireDetailsPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "finances",
        element: <FinancesPage />,
      },
      {
        path: "communications",
        element: <CommunicationsPage />,
      },
      {
        path: "resources",
        element: <ResourcesPage />,
      },
      {
        path: "settings",
        element: <AdminRoute><SettingsPage /></AdminRoute>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
