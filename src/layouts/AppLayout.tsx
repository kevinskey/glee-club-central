
import React, { useEffect, memo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConsolidatedHeader } from "@/components/layout/ConsolidatedHeader";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";

type SidebarType = "admin" | "member" | "fan" | "none";

interface AppLayoutProps {
  sidebarType?: SidebarType;
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = memo(function AppLayout({
  sidebarType = "none",
  showHeader = true,
  showFooter = false,
  title,
  children
}) {
  const isMobile = useIsMobile();
  const { profile, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';
  
  // Set viewport height for mobile - always call this hook
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    
    if (isMobile) {
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
    }
  }, [isMobile]);

  // Set viewport-specific body class - always call this hook
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('is-mobile-view');
    } else {
      document.body.classList.remove('is-mobile-view');
    }
    
    return () => {
      document.body.classList.remove('is-mobile-view');
    };
  }, [isMobile]);
  
  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader message="Loading..." />
      </div>
    );
  }
  
  // Determine which header to show
  const isLandingHeader = sidebarType === "none";
  
  // Determine if we need mobile bottom nav
  const showMobileBottomNav = sidebarType === "none" && isMobile;
  
  // Dynamic sidebar type determination for settings page
  const getEffectiveSidebarType = (): SidebarType => {
    if (sidebarType !== "none") return sidebarType;
    
    // For settings page, determine sidebar based on user role
    if (location.pathname === '/settings') {
      if (isAdmin) return "admin";
      if (profile?.role === 'fan') return "fan";
      return "member";
    }
    
    return sidebarType;
  };
  
  const effectiveSidebarType = getEffectiveSidebarType();

  // Render sidebar based on effective type
  const renderSidebar = () => {
    if (effectiveSidebarType === "none" || isMobile) return null;
    
    switch (effectiveSidebarType) {
      case "admin":
        return <AdminSidebar />;
      case "member":
      case "fan":
        return <Sidebar />;
      default:
        return null;
    }
  };

  // Render mobile nav
  const renderMobileNav = () => {
    if (!isMobile) return null;
    
    if (effectiveSidebarType === "none") {
      return showMobileBottomNav ? <MobileBottomNav /> : null;
    }
    
    return <MobileNav isAdmin={isAdmin} />;
  };

  // Determine main content classes
  const getMainClasses = () => {
    const baseClasses = "flex-1 overflow-x-hidden";
    
    if (effectiveSidebarType === "none") {
      return `${baseClasses} ${showMobileBottomNav ? 'pb-20' : 'pb-6'}`;
    }
    
    return `${baseClasses} p-3 sm:p-4 md:p-5 lg:p-6 md:ml-64 pb-20 md:pb-6`;
  };

  // Layout content with consistent styling
  const layoutContent = (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <Toaster position={isMobile ? "bottom-center" : "top-right"} />
      
      {/* Header */}
      {showHeader && (
        isLandingHeader ? <Header /> : <ConsolidatedHeader />
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        {renderSidebar()}
        
        {/* Main content */}
        <main className={getMainClasses()}>
          <div className="mobile-container">
            {title && (
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
            )}
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      {showFooter && <Footer />}
      
      {/* Mobile Navigation */}
      {renderMobileNav()}
    </div>
  );

  // Wrap with SidebarProvider if we have a sidebar
  if (effectiveSidebarType !== "none") {
    return (
      <SidebarProvider>
        {layoutContent}
      </SidebarProvider>
    );
  }

  return layoutContent;
});

export default AppLayout;
