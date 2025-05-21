
import React, { useEffect, memo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";
import { toast } from "sonner";

// Memoize the header to prevent unnecessary re-renders
const MemoizedHeader = memo(ConsolidatedHeader);
const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMedia("(max-width: 768px)");
  
  useEffect(() => {
    // Set viewport-specific body class
    document.body.classList.toggle('is-mobile-view', isMobile);
    return () => {
      document.body.classList.remove('is-mobile-view');
    }
  }, [isMobile]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("DashboardLayout - User not authenticated, redirecting to login");
    toast.error("Please log in to access the dashboard");
    const returnTo = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${returnTo}`);
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        <MemoizedHeader />
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Only show sidebar on desktop */}
          <div className="hidden md:block">
            <MemoizedSidebar />
          </div>
          
          <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 md:ml-64 pb-20 md:pb-6 overflow-x-hidden">
            <div className="mobile-container">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
