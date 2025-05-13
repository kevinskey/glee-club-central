
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const HomeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Always show header on public routes
  const isPublicRoute = !["/login", "/register", "/register/admin", "/reset-password"].includes(location.pathname);
  
  // Routes where we want to show the bottom navigation
  const showMobileBottomNav = ["/", "/about", "/videos", "/contact", "/press-kit", "/privacy", "/social", "/recordings", "/recordings/submit"].includes(location.pathname);
  
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <div className="min-h-screen flex flex-col bg-background w-full">
          {/* Display header on public routes using our consolidated header */}
          {isPublicRoute && <ConsolidatedHeader />}
          
          <div className={`flex-1 ${isMobile && showMobileBottomNav ? "pb-20" : "pb-6"}`}>
            <Outlet />
          </div>
          
          {/* Mobile bottom navigation */}
          {isMobile && showMobileBottomNav && <MobileBottomNav />}
        </div>
      </SidebarProvider>
    </>
  );
};

export default HomeLayout;
