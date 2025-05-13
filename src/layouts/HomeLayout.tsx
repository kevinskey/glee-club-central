
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface HomeLayoutProps {
  hideHeader?: boolean;
  children?: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ hideHeader = false, children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Routes where we want to show the bottom navigation
  const showMobileBottomNav = ["/", "/about", "/videos", "/contact", "/press-kit", "/privacy", "/social", "/recordings", "/recordings/submit"].includes(location.pathname);
  
  return (
    <>
      <Toaster position={isMobile ? "bottom-center" : "top-right"} expand={isMobile} />
      <div className="min-h-screen flex flex-col bg-background w-full">
        <div className={`flex-1 ${isMobile && showMobileBottomNav ? "pb-20" : "pb-6"}`}>
          {children || (
            <div className={isMobile ? "w-full" : "mobile-container"}>
              <Outlet />
            </div>
          )}
        </div>
        
        {/* Mobile bottom navigation */}
        {isMobile && showMobileBottomNav && <MobileBottomNav />}
      </div>
    </>
  );
};

export default HomeLayout;
