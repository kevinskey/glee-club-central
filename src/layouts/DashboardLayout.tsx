
import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useMedia("(max-width: 768px)");
  
  useEffect(() => {
    console.log("DashboardLayout - Current route:", location.pathname);
  }, [location.pathname]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("DashboardLayout - User not authenticated, redirecting to login");
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        {/* Always show the consolidated header */}
        <ConsolidatedHeader />
        
        <div className="flex-1 flex flex-col md:flex-row">
          <Sidebar />
          
          <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 md:ml-64 pb-20 md:pb-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
