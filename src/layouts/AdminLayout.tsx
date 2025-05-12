
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminLayout() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Only show header on main admin routes
  const shouldShowHeader = ["/admin", "/admin/dashboard", "/dashboard/admin", "/dashboard/admin/dashboard"].includes(location.pathname);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        {shouldShowHeader && (
          <>
            {isMobile ? (
              <MobileHeader />
            ) : (
              <Header />
            )}
          </>
        )}
        <div className="flex-1 flex flex-col md:flex-row">
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
