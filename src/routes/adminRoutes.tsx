import { RouteObject } from "react-router-dom";
import DashboardPage from "@/pages/admin/DashboardPage";
import LandingPageSettingsPage from "@/pages/admin/LandingPageSettingsPage";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import CalendarAdminPage from "@/pages/admin/CalendarAdminPage";
import NewsItemsPage from "@/pages/admin/NewsItemsPage";

// Define the admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "landing",
    element: <LandingPageSettingsPage />,
  },
  {
    path: "media",
    element: <MediaLibrary />,
  },
  {
    path: "calendar",
    element: <CalendarAdminPage />,
  },
  {
    path: "news",
    element: <NewsItemsPage />,
  },
];
