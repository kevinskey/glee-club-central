
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTopNavigation } from '@/components/admin/AdminTopNavigation';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNavigation />
      
      <main className="w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
}
