
import React from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  
  // Close sidebar on route change for mobile
  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar isOpen={true} isAdmin={isAdmin()} />
      
      {/* Mobile Navigation */}
      <MobileNav isAdmin={isAdmin()} />
      
      {/* Overlay when sidebar is open on mobile */}
      {openMobile && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </>
  );
}
