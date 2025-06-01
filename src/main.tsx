
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { RolePermissionProvider } from "./contexts/RolePermissionContext";
import "./index.css";

// Check if dark mode is preferred and apply it immediately to prevent flickering
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Create a client for React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false, // Prevent refetches on window focus
      retry: 1, // Limit retries to reduce UI flicker
    },
  },
});

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Initialize app with proper provider nesting order
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SimpleAuthProvider>
          <RolePermissionProvider>
            <RouterProvider router={router} />
            <Toaster />
          </RolePermissionProvider>
        </SimpleAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
