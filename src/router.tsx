
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const SheetMusicPage = lazy(() => import("./pages/SheetMusicPage"));
const ViewSheetMusicPage = lazy(() => import("./pages/sheet-music/ViewSheetMusicPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    // Remove the direct App import, we'll use Outlet in App.tsx instead
    element: null, // This will be handled in App.tsx
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "admin",
            element: (
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "announcements",
            element: <AnnouncementsPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "sheet-music",
            element: <SheetMusicPage />,
          },
          {
            path: "sheet-music/:id",
            element: <ViewSheetMusicPage />,
          },
        ],
      },
    ],
  },
]);
