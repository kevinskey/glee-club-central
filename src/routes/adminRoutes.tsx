
import { RouteObject } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LandingPageSettingsPage from "@/pages/admin/LandingPageSettingsPage";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import NewsItemsPage from "@/pages/admin/NewsItemsPage";
import SiteSettingsPage from "@/pages/admin/SiteSettingsPage";

console.log('Admin routes loading...');

// Define the admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AdminDashboard />,
  },
  {
    path: "/landing",
    element: <LandingPageSettingsPage />,
  },
  {
    path: "/media", 
    element: <MediaLibrary />,
  },
  {
    path: "/news",
    element: <NewsItemsPage />,
  },
  {
    path: "/settings",
    element: <SiteSettingsPage />,
  },
];

console.log('Admin routes configured:', adminRoutes.map(r => r.path));
