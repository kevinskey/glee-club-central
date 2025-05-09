
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "@/hooks/use-sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const { isOpen, onClose } = useSidebar();

  // Close sidebar on route change for mobile
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar isOpen={isOpen} isAdmin={isAdmin()} />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
