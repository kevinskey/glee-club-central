
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MobileAdminDashboard } from '@/components/admin/MobileAdminDashboard';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-4">
          {children || <Outlet />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
