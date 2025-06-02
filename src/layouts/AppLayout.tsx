
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

interface AppLayoutProps {
  children?: React.ReactNode;
  sidebarType?: 'none' | 'admin' | 'member';
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function AppLayout({ 
  children, 
  sidebarType = 'none', 
  showHeader = true, 
  showFooter = true 
}: AppLayoutProps) {
  const { isAdmin } = useAuth();

  const renderSidebar = () => {
    switch (sidebarType) {
      case 'admin':
        return <AdminSidebar />;
      case 'member':
        return <DashboardSidebar />;
      default:
        return null;
    }
  };

  const hasSidebar = sidebarType !== 'none';

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
    </div>
  );
}
