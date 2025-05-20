
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  // For dashboard routes, we'll use DashboardLayout directly
  return <DashboardLayout />;
}

export default App;
