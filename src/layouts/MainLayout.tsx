
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ConsolidatedHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Spelman College Glee Club
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
