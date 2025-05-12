
import React from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useMedia } from "@/hooks/use-mobile";

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useMedia("(max-width: 768px)");
  
  // Close sidebar on route change for mobile
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, setOpenMobile, isMobile]);

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopSidebar isOpen={true} isAdmin={isAdmin()} />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav isAdmin={isAdmin()} />
      
      {/* Overlay when sidebar is open on mobile - Hidden */}
      {openMobile && !isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </>
  );
}
