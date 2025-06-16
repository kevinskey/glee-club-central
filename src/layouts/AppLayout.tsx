
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
  
  console.log('🚨 AppLayout: This component should not be rendering headers anymore!', location.pathname);
  
  // AppLayout should not render any headers since AppContent handles this
  // This component might be legacy and should be cleaned up
  return (
    <div className="min-h-screen bg-background">
      <main>
        {children}
      </main>
    </div>
  );
}
