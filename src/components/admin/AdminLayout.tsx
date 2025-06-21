
import React from "react";
import { Outlet } from "react-router-dom";

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};
