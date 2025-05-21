
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Header } from "@/components/landing/Header";

interface HomeLayoutProps {
  hideHeader?: boolean;
  children?: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ hideHeader = false, children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Routes where we want to show the bottom navigation
  const showMobileBottomNav = ["/", "/about", "/videos", "/contact", "/press-kit", "/privacy", "/social", "/recordings", "/recordings/submit"].includes(location.pathname);
  
  // Set viewport height for mobile
  useEffect(() => {
    if (isMobile) {
      // Fix the iOS 100vh issue
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVh();
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
    }
  }, [isMobile]);
  
  return (
    <>
      <Toaster position={isMobile ? "bottom-center" : "top-right"} expand={isMobile} />
      <div className="min-h-screen flex flex-col bg-background w-full">
        {!hideHeader && <Header />}
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
