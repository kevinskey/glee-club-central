
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { FloatingThemeToggle } from '@/components/ui/floating-theme-toggle';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { DynamicDashboardSidebar } from '@/components/dashboard/DynamicDashboardSidebar';
import { MobileDashboardSidebar, MobileDashboardSidebarTrigger } from '@/components/dashboard/MobileDashboardSidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AppLayoutProps {
  children?: React.ReactNode;
  sidebarType?: 'none' | 'admin' | 'member' | 'dashboard';
  showHeader?: boolean;
  showFooter?: boolean;
  showFloatingThemeToggle?: boolean;
}

export default function AppLayout({ 
  children, 
  sidebarType = 'none', 
  showHeader = true, 
  showFooter = true,
  showFloatingThemeToggle = false
}: AppLayoutProps) {
  const { isAdmin } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const renderSidebar = () => {
    switch (sidebarType) {
      case 'admin':
        return <AdminSidebar />;
      case 'dashboard':
        return isDesktop ? (
          <DynamicDashboardSidebar />
        ) : (
          <MobileDashboardSidebar 
            open={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen} 
          />
        );
      case 'member':
        // For now, no specific member sidebar - could add one later if needed
        return null;
      default:
        return null;
    }
  };

  const hasSidebar = sidebarType !== 'none' && renderSidebar() !== null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      {showHeader && <div className="hidden md:block"><Header /></div>}
      
      {/* Mobile Header - Fixed positioning */}
      <div className="block md:hidden">
        {sidebarType === 'dashboard' ? (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Glee Dashboard
              </h1>
              <MobileDashboardSidebarTrigger onOpen={() => setMobileMenuOpen(true)} />
            </div>
          </div>
        ) : (
          <MobileHeader />
        )}
      </div>
      
      <div className="flex-1 flex">
        {renderSidebar()}
        
        <main className={`flex-1 ${hasSidebar && isDesktop ? 'lg:ml-64' : ''} ${sidebarType === 'dashboard' ? 'pt-20 md:pt-0' : 'pt-28 md:pt-0'}`}>
          {children || <Outlet />}
        </main>
      </div>
      
      {showFooter && <Footer />}
      
      {/* Show floating theme toggle if requested and no header/sidebar theme toggle is present */}
      {showFloatingThemeToggle && !showHeader && !hasSidebar && (
        <FloatingThemeToggle position="top-right" />
      )}
    </div>
  );
}
