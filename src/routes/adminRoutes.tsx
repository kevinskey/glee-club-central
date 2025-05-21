
import { RouteObject } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LandingPageSettingsPage from "@/pages/admin/LandingPageSettingsPage";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import EventCalendar from "@/pages/admin/EventCalendar";
import NewsItemsPage from "@/pages/admin/NewsItemsPage";

// Define the admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AdminDashboard />,
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
    element: <EventCalendar />,
  },
  {
    path: "news",
    element: <NewsItemsPage />,
  },
];
