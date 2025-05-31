
import { RouteObject } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LandingPageSettingsPage from "@/pages/admin/LandingPageSettingsPage";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import NewsItemsPage from "@/pages/admin/NewsItemsPage";
import SiteSettingsPage from "@/pages/admin/SiteSettingsPage";
import AdminHeroManager from "@/pages/admin/AdminHeroManager";
import AdminMediaUploaderPage from "@/pages/admin/AdminMediaUploaderPage";
import EventDetailsPage from '@/pages/events/EventDetailsPage';

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
    path: "/media-uploader",
    element: <AdminMediaUploaderPage />,
  },
  {
    path: "/hero-manager",
    element: <AdminHeroManager />,
  },
  {
    path: "/news",
    element: <NewsItemsPage />,
  },
  {
    path: "/settings",
    element: <SiteSettingsPage />,
  },
  {
    path: "/admin/events/:id",
    element: <EventDetailsPage />,
  },
];

console.log('Admin routes configured:', adminRoutes.map(r => r.path));
