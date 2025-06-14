
import React from "react";
import { useLocation } from "react-router-dom";
import { UnifiedPublicHeader } from "@/components/landing/UnifiedPublicHeader";
import { AdminUnifiedHeader } from "@/components/admin/AdminUnifiedHeader";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Pages that manage their own headers completely (including TopSlider)
  const pagesWithOwnHeaders = [
    '/login', 
    '/signup', 
    '/', // HomePage manages its own header via PublicPageWrapper
    '/contact' // ContactPage manages its own header and footer
  ];
  
  const shouldShowHeader = !pagesWithOwnHeaders.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {shouldShowHeader && (
        <>
          {isAdminPage ? (
            <AdminUnifiedHeader />
          ) : (
            <UnifiedPublicHeader />
          )}
        </>
      )}
      <main className={shouldShowHeader ? "" : "pt-0"}>
        {children}
      </main>
    </div>
  );
}
