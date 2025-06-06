
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./App.css";

// Import pages that will be rendered
import UnifiedSlideManagementPage from "@/pages/admin/UnifiedSlideManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "admin/unified-slide-management",
        element: <UnifiedSlideManagementPage />,
      },
      // Add other routes as needed
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
