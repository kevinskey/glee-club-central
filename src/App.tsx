
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  // App now simply returns the DashboardLayout, which handles routing internally
  return <DashboardLayout />;
}

export default App;
