
import React, { useEffect, memo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMedia } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

// Memoize the header and sidebar to prevent unnecessary re-renders
const MemoizedHeader = memo(ConsolidatedHeader);
const MemoizedSidebar = memo(Sidebar);
const MemoizedMobileNav = memo(MobileNav);

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useMedia("(max-width: 768px)");
  const { profile } = useAuth();
  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';
  
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
        
        {/* Mobile Navigation */}
        <MemoizedMobileNav isAdmin={isAdmin} />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
