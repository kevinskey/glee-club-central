import React from "react";
import { Outlet } from "react-router-dom";
import { AdminTopNavigation } from "./AdminTopNavigation";

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="glass-glee sticky top-0 z-50 border-b border-white/20">
        <AdminTopNavigation />
      </div>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};
