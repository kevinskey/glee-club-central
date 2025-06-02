
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./index.css";

// Check if dark mode is preferred and apply it immediately to prevent flickering
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
  document.documentElement.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
}

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
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
