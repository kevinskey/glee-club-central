
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { FloatingThemeToggle } from '@/components/ui/floating-theme-toggle';

interface AppLayoutProps {
  children?: React.ReactNode;
  sidebarType?: 'none' | 'admin' | 'member';
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

  const renderSidebar = () => {
    switch (sidebarType) {
      case 'admin':
        return <AdminSidebar />;
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
      {showHeader && <Header />}
      
      <div className="flex-1 flex">
        {renderSidebar()}
        
        <main className={`flex-1 ${hasSidebar ? 'lg:ml-64' : ''}`}>
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
