
import React from "react";
import { Outlet } from "react-router-dom";

const PDFViewerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      {/* No header or sidebar - PDF viewer takes full control */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default PDFViewerLayout;
