
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalMetronome } from "@/components/ui/global-metronome";

export default function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log("DashboardLayout - Auth check:", { isAuthenticated, isLoading });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("DashboardLayout - User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        <Header />
        
        <div className="flex-1 flex flex-col md:flex-row">
          <Sidebar />
          
          <main className="flex-1 p-2 sm:p-3 md:p-5 lg:p-6 md:ml-64 pb-12 md:pb-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
        
        <GlobalMetronome />
      </div>
    </SidebarProvider>
  );
}
