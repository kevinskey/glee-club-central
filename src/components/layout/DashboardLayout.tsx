
import React from "react";
import { Outlet } from "react-router-dom";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";

export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <ConsolidatedHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
