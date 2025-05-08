
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import CalendarPage from "@/pages/CalendarPage";
import SheetMusicPage from "@/pages/SheetMusicPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import RecordingsPage from "@/pages/RecordingsPage";
import LandingPage from "@/pages/LandingPage";
import FanPage from "@/pages/FanPage";
import DashboardPage from "@/pages/DashboardPage";
import AttendancePage from "@/pages/AttendancePage";
import PerformanceChecklistPage from "@/pages/PerformanceChecklistPage";

// This file is used for reference only - actual routes are now in App.tsx
// We keep this for future reference or if we want to switch back to RouterProvider
const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/fan-page",
    element: <FanPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/update-password",
    element: <UpdatePasswordPage />,
  },
  
  // Protected dashboard routes
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        path: "", // Dashboard home
        element: <DashboardPage />, // Using DashboardPage component
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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "recordings",
        element: <RecordingsPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "performance-checklist",
        element: <PerformanceChecklistPage />,
      },
      // The remaining routes will use the "Not Found" page until implemented
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ],
  },
  
  // Catch-all for 404
  {
    path: "*",
    element: <NotFoundPage />,
  }
];

export default routes;
