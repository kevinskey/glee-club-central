import React from "react";
import { useRoutes } from "react-router-dom";
import { HomeLayout } from "@/layouts/HomeLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import UserManagement from "@/pages/admin/UserManagement";
import EventCalendar from "@/pages/admin/EventCalendar";
import FinancialRecords from "@/pages/admin/FinancialRecords";
import SettingsPage from "@/pages/admin/SettingsPage";
import { Spinner } from "@/components/ui/spinner";

const ProfilePage = React.lazy(() => import("@/pages/profile/ProfilePage"));
const AnnouncementsPage = React.lazy(() => import("@/pages/dashboard/AnnouncementsPage"));
const ArchivesPage = React.lazy(() => import("@/pages/dashboard/ArchivesPage"));
const MusicPage = React.lazy(() => import("@/pages/dashboard/MusicPage"));
const MembersPage = React.lazy(() => import("@/pages/dashboard/MembersPage"));
const AttendancePage = React.lazy(() => import("@/pages/dashboard/AttendancePage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));

export default function AppRoutes() {
  let element = useRoutes([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "login", element: <LoginPage /> },
        {
          path: "about",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AboutPage />
            </React.Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <ContactPage />
            </React.Suspense>
          ),
        },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "", element: <DashboardPage /> },
        {
          path: "announcements",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AnnouncementsPage />
            </React.Suspense>
          ),
        },
        {
          path: "archives",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <ArchivesPage />
            </React.Suspense>
          ),
        },
        {
          path: "music",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <MusicPage />
            </React.Suspense>
          ),
        },
        {
          path: "members",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <MembersPage />
            </React.Suspense>
          ),
        },
        {
          path: "attendance",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AttendancePage />
            </React.Suspense>
          ),
        },
        {
          path: "profile",
          element: (
            <React.Suspense fallback={<Spinner />}>
              <ProfilePage />
            </React.Suspense>
          ),
        },
      ],
    },
    {
      path: "/dashboard/admin",
      element: <DashboardLayout />,
      children: [
        { path: "", element: <AdminDashboard /> },
        { path: "media", element: <MediaLibrary /> },
        { path: "users", element: <UserManagement /> },
        { path: "events", element: <EventCalendar /> },
        { path: "financial", element: <FinancialRecords /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ]);
  return element;
}
