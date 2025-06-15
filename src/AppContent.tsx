import React from "react";
import { useLocation } from "react-router-dom";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";
import { AdminUnifiedHeader } from "@/components/admin/AdminUnifiedHeader";
import { useAuth } from "@/contexts/AuthContext";

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Dashboard pages that should not show the unified header (they manage their own)
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/role-dashboard');
  
  // Pages that manage their own headers completely (including TopSlider)
  const pagesWithOwnHeaders = [
    '/login', 
    '/signup', 
    '/', // HomePage manages its own header via PublicPageWrapper
    '/contact', // ContactPage manages its own header and footer
    '/calendar' // Calendar page manages its own header
  ];
  
  // Admin pages should NOT show any unified header as they use AdminLayout
  const shouldShowHeader = !pagesWithOwnHeaders.includes(location.pathname) && 
                          !isDashboardPage &&
                          !isAdminPage;

  return (
    <div className="min-h-screen bg-background">
      {shouldShowHeader && (
        <UnifiedPublicHeader />
      )}
      <main className={shouldShowHeader ? "" : "pt-0"}>
        {children}
      </main>
    </div>
  );
}
