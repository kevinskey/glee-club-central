
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Header } from "@/components/landing/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

const HomeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Only show header on the main route
  const shouldShowHeader = location.pathname === "/";
  
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <div className="min-h-screen flex flex-col bg-background w-full">
          {/* Only show headers on main route */}
          {shouldShowHeader && (
            <>
              {isMobile ? (
                <MobileHeader />
              ) : (
                <Header initialShowNewsFeed={false} />
              )}
            </>
          )}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomeLayout;
