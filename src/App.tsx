
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default App;
