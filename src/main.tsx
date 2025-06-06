
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";

// Import main pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/auth/LoginPage';
import RoleDashboardPage from '@/pages/RoleDashboardPage';
import CalendarPage from '@/pages/CalendarPage';
import EnhancedCalendarPage from '@/pages/EnhancedCalendarPage';

// Import route configurations
import { adminRoutes } from '@/routes/adminRoutes';
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { roleRoutes } from '@/routes/roleRoutes';
import { memberRoutes } from '@/routes/memberRoutes';

// Check if dark mode is preferred and apply it immediately to prevent flickering
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Create router with App as root and all routes as children
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'calendar',
        element: <EnhancedCalendarPage />,
      },
      // Dashboard routes
      {
        path: 'dashboard',
        element: <RoleDashboardPage />,
      },
      ...roleRoutes,
      ...memberRoutes,
      ...adminRoutes,
      ...dashboardRoutes,
    ],
  },
]);

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Initialize app with proper React Router setup
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
