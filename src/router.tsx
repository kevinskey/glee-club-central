import {
  createBrowserRouter,
} from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import AttendancePage from "./pages/AttendancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import PracticeResourcesPage from "./pages/PracticeResourcesPage";
import ContactAdminPage from "./pages/ContactAdminPage";
import AdminLayout from "./layouts/AdminLayout";
import UserManagementPage from "./pages/admin/UserManagementPage";
import EventManagerPage from "./pages/admin/EventManagerPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./components/auth/RequireAuth";
import MembersPage from "./pages/MembersPage";
import AdminMembersPage from "./pages/AdminMembersPage";
import SheetMusicPage from "./pages/SheetMusicPage";
import SheetMusicViewerPage from "./pages/sheet-music/SheetMusicPage";
import ViewSheetMusicPage from "./pages/sheet-music/ViewSheetMusicPage";
import SetlistsPage from "./pages/SetlistsPage";
import ChoralTitlesPage from "./pages/sheet-music/ChoralTitlesPage";
import YoutubeVideosPage from "./pages/YoutubeVideosPage";
import PressKitPage from "./pages/PressKitPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/videos",
        element: <YoutubeVideosPage />,
      },
      {
        path: "/press-kit",
        element: <PressKitPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/dashboard/attendance",
        element: <AttendancePage />,
      },
      {
        path: "/dashboard/announcements",
        element: <AnnouncementsPage />,
      },
      {
        path: "/dashboard/practice",
        element: <PracticeResourcesPage />,
      },
      {
        path: "/dashboard/contact",
        element: <ContactAdminPage />,
      },
	  {
        path: "/dashboard/sheet-music",
        element: <SheetMusicPage />,
      },
	  {
        path: "/dashboard/sheet-music/:id",
        element: <ViewSheetMusicPage />,
      },
    {
        path: "/dashboard/setlists",
        element: <SetlistsPage />,
      },
    {
        path: "/dashboard/sheet-music/choral-titles",
        element: <ChoralTitlesPage />,
      },
    ],
  },
  {
    path: "/dashboard/admin",
    element: (
      <RequireAuth requiredRole="admin">
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "/dashboard/admin/members",
        element: <AdminMembersPage />,
      },
      {
        path: "/dashboard/admin/users",
        element: <UserManagementPage />,
      },
      {
        path: "/dashboard/admin/events",
        element: <EventManagerPage />,
      },
      {
        path: "/dashboard/admin/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/dashboard/admin/settings",
        element: <SiteSettingsPage />,
      },
    ],
  },
]);
