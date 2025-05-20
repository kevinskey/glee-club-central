
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  // The path will determine which layout to use
  const path = window.location.pathname;
  
  // If the path starts with /dashboard, use the DashboardLayout
  if (path.startsWith("/dashboard")) {
    return <DashboardLayout />;
  }
  
  // For all other routes, just render the Outlet
  return <Outlet />;
}

export default App;
