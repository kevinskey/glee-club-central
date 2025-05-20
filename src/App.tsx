
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  // Get location through React Router's hook instead of window.location
  const location = useLocation();
  const path = location.pathname;
  
  // If the path starts with /dashboard, use the DashboardLayout
  if (path.startsWith("/dashboard")) {
    return <DashboardLayout />;
  }
  
  // For all other routes, just render the Outlet
  return <Outlet />;
}

export default App;
