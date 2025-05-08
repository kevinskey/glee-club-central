
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
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

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <LandingPage />,
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
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "", // Dashboard home
        element: <DashboardPage />,
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
]);

export default router;
