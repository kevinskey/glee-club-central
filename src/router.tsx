
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
import DesignStudioPage from "./pages/DesignStudioPage";
import AutoProductGeneratorPage from "./pages/AutoProductGeneratorPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import ExecutiveDashboard from "./pages/dashboard/ExecutiveDashboard";
import TreasurerDashboard from "./pages/dashboard/TreasurerDashboard";
import LibrarianDashboard from "./pages/dashboard/LibrarianDashboard";
import HistorianDashboard from "./pages/dashboard/HistorianDashboard";
import MemberCSVUploadPage from "./pages/admin/MemberCSVUploadPage";
import EnhancedCalendarPage from "./pages/EnhancedCalendarPage";
import NotFoundPage from "./pages/NotFoundPage";
import { adminRoutes } from "./routes/adminRoutes";
import { adminRoutesV2 } from "./routes/adminRoutesV2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "dashboard",
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
        path: "store",
        element: <StorePage />,
      },
      {
        path: "design-studio",
        element: <DesignStudioPage />,
      },
      {
        path: "auto-generator",
        element: <AutoProductGeneratorPage />,
      },
      // Add all admin routes (original)
      ...adminRoutes,
      // Add all v2 admin routes
      ...adminRoutesV2,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
