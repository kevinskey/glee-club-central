
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AttendancePage from "./pages/AttendancePage";
import StorePage from "./pages/StorePage";
import AutoProductGeneratorPage from "./pages/AutoProductGeneratorPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import ExecutiveDashboard from "./pages/dashboard/ExecutiveDashboard";
import TreasurerDashboard from "./pages/dashboard/TreasurerDashboard";
import LibrarianDashboard from "./pages/dashboard/LibrarianDashboard";
import HistorianDashboard from "./pages/dashboard/HistorianDashboard";
import MemberCSVUploadPage from "./pages/admin/MemberCSVUploadPage";
import EnhancedCalendarPage from "./pages/EnhancedCalendarPage";
import SheetMusicPage from "./pages/SheetMusicPage";
import ViewSheetMusicPage from "./pages/sheet-music/ViewSheetMusicPage";
import PracticePage from "./pages/practice/PracticePage";
import MembersPage from "./pages/MembersPage";
import NotFoundPage from "./pages/NotFoundPage";
import MediaPage from "./pages/MediaPage";
import { AdminRoutes } from "./routes/adminRoutes";
import { adminRoutesV2 } from "./routes/adminRoutesV2";
import { dashboardRoutes } from "./routes/dashboardRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "calendar",
        element: <EnhancedCalendarPage />,
      },
      {
        path: "media",
        element: <MediaPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "members",
        element: <MembersPage />,
      },
      {
        path: "dashboard",
        element: <RoleDashboardPage />,
      },
      {
        path: "role-dashboard",
        element: <RoleDashboardPage />,
      },
      {
        path: "dashboard/executive",
        element: <ExecutiveDashboard />,
      },
      {
        path: "exec/treasurer",
        element: <TreasurerDashboard />,
      },
      {
        path: "exec/librarian",
        element: <LibrarianDashboard />,
      },
      {
        path: "exec/historian",
        element: <HistorianDashboard />,
      },
      {
        path: "admin/csv-upload",
        element: <MemberCSVUploadPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "practice",
        element: <PracticePage />,
      },
      {
        path: "store",
        element: <StorePage />,
      },
      {
        path: "merchandise",
        element: <StorePage />,
      },
      {
        path: "auto-generator",
        element: <AutoProductGeneratorPage />,
      },
      {
        path: "sheet-music",
        element: <SheetMusicPage />,
      },
      {
        path: "sheet-music/view/:id",
        element: <ViewSheetMusicPage />,
      },
      // Add all dashboard routes
      ...dashboardRoutes,
      // Add admin routes as nested component
      {
        path: "admin/*",
        element: <AdminRoutes />,
      },
      // Add all v2 admin routes
      ...adminRoutesV2,
    ],
  },
  // Catch-all route for 404s
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
