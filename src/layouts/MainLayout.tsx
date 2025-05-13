
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ConsolidatedHeader } from '@/components/layout/ConsolidatedHeader';

export const MainLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Routes where the bottom navigation should be shown
  const showBottomNav = ['/', '/about', '/videos', '/contact', '/press-kit', '/privacy'].includes(location.pathname);
  
  useEffect(() => {
    // Set viewport-specific body class
    document.body.classList.toggle('is-mobile-view', isMobile);
    return () => {
      document.body.classList.remove('is-mobile-view');
    }
  }, [isMobile]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Using the ConsolidatedHeader component which works for both mobile and desktop */}
      <ConsolidatedHeader />
      
      <main className={`flex-1 ${isMobile && showBottomNav ? 'pb-16' : ''}`}>
        <div className={isMobile ? "w-full" : "mobile-container"}>
          <Outlet />
        </div>
      </main>
      
      <Footer />
      
      {/* Show the bottom nav on mobile for specific routes */}
      {isMobile && showBottomNav && <MobileBottomNav />}
    </div>
  );
};

export default MainLayout;
