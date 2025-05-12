
import React from "react";
import { useRoutes } from "react-router-dom";
import HomeLayout from "@/layouts/HomeLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import { Spinner } from "@/components/ui/spinner";

const ProfilePage = React.lazy(() => import("@/pages/profile/ProfilePage"));
const AnnouncementsPage = React.lazy(() => import("@/pages/AnnouncementsPage"));
const MusicPage = React.lazy(() => import("@/pages/SheetMusicPage"));
const MembersPage = React.lazy(() => import("@/pages/MembersPage"));
const AttendancePage = React.lazy(() => import("@/pages/AttendancePage"));
const ArchivesPage = React.lazy(() => import("@/pages/MediaLibraryPage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const AdminDashboardPage = React.lazy(() => import("@/pages/AdminDashboardPage"));
const MediaLibraryPage = React.lazy(() => import("@/pages/media-library/MediaLibraryPage"));
const UserManagementPage = React.lazy(() => import("@/pages/admin/UserManagementPage"));
const EventCalendarPage = React.lazy(() => import("@/pages/calendar/CalendarPage"));
const AdminFinancesPage = React.lazy(() => import("@/pages/AdminFinancesPage"));
const AdminSettingsPage = React.lazy(() => import("@/pages/AdminSettingsPage"));

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
        { path: "", element: <AdminPage /> },
        { 
          path: "dashboard", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AdminDashboardPage />
            </React.Suspense>
          )
        },
        { 
          path: "media", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <MediaLibraryPage />
            </React.Suspense>
          )
        },
        { 
          path: "users", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <UserManagementPage />
            </React.Suspense>
          )
        },
        { 
          path: "events", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <EventCalendarPage />
            </React.Suspense>
          )
        },
        { 
          path: "financial", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AdminFinancesPage />
            </React.Suspense>
          )
        },
        { 
          path: "settings", 
          element: (
            <React.Suspense fallback={<Spinner />}>
              <AdminSettingsPage />
            </React.Suspense>
          )
        },
      ],
    },
  ]);
  return element;
}
