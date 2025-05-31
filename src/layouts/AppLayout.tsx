
import React, { useEffect, memo } from "react";
import { Outlet } from "react-router-dom";
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
  const { profile } = useAuth();
  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';
  
  // Determine which header to show
  const isLandingHeader = sidebarType === "none";
  
  // Determine if we need mobile bottom nav
  const showMobileBottomNav = sidebarType === "none" && isMobile;
  
  // Set viewport height for mobile
  useEffect(() => {
    if (isMobile) {
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVh();
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
    }
  }, [isMobile]);

  // Set viewport-specific body class
  useEffect(() => {
    document.body.classList.toggle('is-mobile-view', isMobile);
    return () => {
      document.body.classList.remove('is-mobile-view');
    }
  }, [isMobile]);

  // Render sidebar based on type
  const renderSidebar = () => {
    if (sidebarType === "none" || isMobile) return null;
    
    switch (sidebarType) {
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
    
    if (sidebarType === "none") {
      return showMobileBottomNav ? <MobileBottomNav /> : null;
    }
    
    return <MobileNav isAdmin={isAdmin} />;
  };

  // Determine main content classes
  const getMainClasses = () => {
    const baseClasses = "flex-1 overflow-x-hidden";
    
    if (sidebarType === "none") {
      return `${baseClasses} ${showMobileBottomNav ? 'pb-20' : 'pb-6'}`;
    }
    
    return `${baseClasses} p-3 sm:p-4 md:p-5 lg:p-6 ${sidebarType !== "none" ? 'md:ml-64' : ''} pb-20 md:pb-6`;
  };

  // Layout content
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
          <div className={sidebarType === "none" && !isMobile ? "mobile-container" : "mobile-container"}>
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
  if (sidebarType !== "none") {
    return (
      <SidebarProvider>
        {layoutContent}
      </SidebarProvider>
    );
  }

  return layoutContent;
});

export default AppLayout;
