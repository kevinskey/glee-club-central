
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useMedia } from "@/hooks/use-mobile";

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const isMobile = useMedia("(max-width: 768px)");

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <DesktopSidebar isOpen={true} isAdmin={isAdmin()} />
      
      {/* Mobile Navigation - Only shown on mobile */}
      {isMobile && <MobileNav isAdmin={isAdmin()} />}
    </>
  );
}
