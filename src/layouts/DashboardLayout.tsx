
import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/layout/MobileHeader";

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isMobile = useMedia("(max-width: 768px)");
  
  // Only show header on the main dashboard route
  const shouldShowHeader = location.pathname === "/dashboard";
  
  // Log current route for troubleshooting
  useEffect(() => {
    console.log("DashboardLayout - Current route:", location.pathname);
  }, [location.pathname]);
  
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
    // Store the intended destination for post-login redirect
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        {/* Only show headers on main dashboard route */}
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
