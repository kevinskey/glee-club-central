
import { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BaseLayout } from "@/components/layout/BaseLayout";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import EventsPage from "@/pages/EventsPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AdministrationPage from "@/pages/AdministrationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { adminRoutes } from "@/routes/adminRoutes";
import RecordingsPage from "@/pages/recordings/RecordingsPage"; // Use recordings folder path
import RecordingStudioPage from "@/pages/recordings/RecordingStudioPage";
import AudioManagementPage from "@/pages/audio-management/AudioManagementPage";
import PracticePage from "@/pages/practice/PracticePage";
import SheetMusicPage from "@/pages/SheetMusicPage";

// Route definitions
const routes: RouteObject[] = [
  // Public routes
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
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
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/admin",
        element: <AdministrationPage />,
      },
      {
        path: "/recordings",
        element: <RecordingsPage />,
      },
      {
        path: "/audio-management",
        element: <AudioManagementPage />,
      },
      {
        path: "/practice",
        element: <PracticePage />,
      },
      {
        path: "/sheet-music",
        element: <SheetMusicPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  // Dashboard routes (protected)
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      // Base recordings route under dashboard
      {
        path: "recordings",
        element: <RecordingsPage />,
      },
      // Admin routes
      {
        path: "admin/*",
        children: adminRoutes,
      }
    ],
  },
];

export default routes;
