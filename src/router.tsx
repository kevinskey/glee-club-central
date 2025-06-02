import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminHomePage from "./pages/AdminHomePage";
import AttendancePage from "./pages/AttendancePage";
import PaymentsPage from "./pages/PaymentsPage";
import SectionsPage from "./pages/SectionsPage";
import PracticeLogsPage from "./pages/PracticeLogsPage";
import MediaPage from "./pages/MediaPage";
import StorePage from "./pages/StorePage";
import DesignStudioPage from "./pages/DesignStudioPage";
import AutoProductGeneratorPage from "./pages/AutoProductGeneratorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin",
        element: <AdminHomePage />,
      },
      {
        path: "/attendance",
        element: <AttendancePage />,
      },
      {
        path: "/payments",
        element: <PaymentsPage />,
      },
      {
        path: "/sections",
        element: <SectionsPage />,
      },
      {
        path: "/practice-logs",
        element: <PracticeLogsPage />,
      },
      {
        path: "/media",
        element: <MediaPage />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
      {
        path: "/design-studio",
        element: <DesignStudioPage />,
      },
      {
        path: "/auto-generator",
        element: <AutoProductGeneratorPage />,
      },
    ],
  },
]);

export default router;
