
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Header } from "@/components/landing/Header"; // Import the Header component

const HomeLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Routes where we want to show the bottom navigation
  const showMobileBottomNav = ["/", "/about", "/videos", "/contact", "/press-kit", "/privacy", "/social", "/recordings", "/recordings/submit"].includes(location.pathname);
  
  // Don't show header on login/auth pages
  const isAuthPage = location.pathname.startsWith('/auth/');
  
  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col bg-background w-full">
        {!isAuthPage && <Header initialShowNewsFeed={location.pathname === '/'} />}
        <div className={`flex-1 ${isMobile && showMobileBottomNav ? "pb-20" : "pb-6"}`}>
          <Outlet />
        </div>
        
        {/* Mobile bottom navigation */}
        {isMobile && showMobileBottomNav && <MobileBottomNav />}
      </div>
    </>
  );
};

export default HomeLayout;
