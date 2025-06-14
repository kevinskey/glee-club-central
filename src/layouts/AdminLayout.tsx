
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminUnifiedHeader } from '@/components/admin/AdminUnifiedHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="min-h-screen bg-background">
      <AdminUnifiedHeader />
      
      <div className="flex">
        {isDesktop && <AdminSidebar />}
        
        <main className={`flex-1 ${isDesktop ? 'ml-64' : ''}`}>
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
