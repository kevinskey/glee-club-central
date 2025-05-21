
import React from "react";
import { Outlet } from "react-router-dom";

export function BaseLayout() {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
