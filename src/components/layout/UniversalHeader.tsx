
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/landing/Header";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { useIsMobile } from "@/hooks/use-mobile";

export function UniversalHeader() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Special handling for auth pages that might want no header
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  
  if (isAuthPage) {
    return null; // No header for auth pages
  }

  return (
    <div className="sticky top-0 z-50 w-full">
      {isAdminPage ? (
        <AdminTopBar isMobile={isMobile} />
      ) : (
        <Header />
      )}
    </div>
  );
}
