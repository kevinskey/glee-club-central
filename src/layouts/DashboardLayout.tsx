
import React, { useEffect, memo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

// Memoize the header and sidebar to prevent unnecessary re-renders
const MemoizedHeader = memo(ConsolidatedHeader);
const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useMedia("(max-width: 768px)");
  const location = useLocation();
  const { isLoading } = useAuth();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
  
  useEffect(() => {
    // Set viewport-specific body class
    document.body.classList.toggle('is-mobile-view', isMobile);
    return () => {
      document.body.classList.remove('is-mobile-view');
    };
  }, [isMobile]);

  // Layout mount effect to prevent layout shifts
  useEffect(() => {
    // Add a slight delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Reset layout mounting when route changes
  useEffect(() => {
    setIsLayoutMounted(false);
    const timer = setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Fade-in transition classes to reduce blinking
  const layoutClasses = `min-h-screen flex flex-col bg-background w-full transition-opacity duration-300 ${
    isLayoutMounted && !isLoading ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <SidebarProvider>
      <div className={layoutClasses}>
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
