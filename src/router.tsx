
import {
  createBrowserRouter,
} from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardPage from "@/pages/DashboardPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import MembersPage from "@/pages/admin/MembersPage";
import UsersPage from "@/pages/admin/UsersPage";
import FinancialRecords from "@/pages/admin/FinancialRecords";
import MediaLibraryPage from "@/pages/admin/MediaLibraryPage";
import EventManagerPage from "@/pages/admin/EventManagerPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import SectionManagerPage from "@/pages/admin/SectionManagerPage";
import SiteSettingsPage from "@/pages/admin/SiteSettingsPage";
import HomePage from "@/pages/HomePage";
import HomeLayout from "@/layouts/HomeLayout";
import RecordingsPage from "@/pages/RecordingsPage";
import { MainLayout } from "@/layouts/MainLayout";
import PressKitPage from "@/pages/PressKitPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import LandingPageSettingsPage from "@/pages/admin/LandingPageSettingsPage";
import AdminRegistrationPage from "@/pages/admin/AdminRegistrationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorBoundary children={null} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "press-kit", element: <PressKitPage /> },
      { path: "recordings", element: <RecordingsPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary children={null} />,
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary children={null} />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "members", element: <MembersPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "finances", element: <FinancialRecords /> },
      { path: "media-library", element: <MediaLibraryPage /> },
      { path: "events", element: <EventManagerPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "sections", element: <SectionManagerPage /> },
      { path: "site-settings", element: <SiteSettingsPage /> },
      { path: "landing-page", element: <LandingPageSettingsPage /> },
    ],
  },
  {
    path: "/login",
    element: <MainLayout />,
    errorElement: <ErrorBoundary children={null} />,
    children: [
      {
        index: true,
        lazy: async () => {
          let LoginPage = (await import("./pages/LoginPage")).default
          return { Component: LoginPage }
        },
      },
    ],
  },
  {
    path: "/register",
    element: <MainLayout />,
    errorElement: <ErrorBoundary children={null} />,
    children: [
      {
        index: true,
        lazy: async () => {
          let RegisterPage = (await import("./pages/RegisterPage")).default
          return { Component: RegisterPage }
        },
      },
      {
        path: "admin",
        lazy: async () => {
          // Use the AdminRegistrationPage that is properly imported at the top
          return { Component: AdminRegistrationPage }
        },
      },
    ],
  },
]);

export default router;
