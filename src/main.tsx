import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";

// Import route configurations
import { publicRoutes } from '@/routes/publicRoutes';
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
      ...roleRoutes,
      ...memberRoutes,
      ...publicRoutes,
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
