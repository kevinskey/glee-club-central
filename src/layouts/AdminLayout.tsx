
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTopNavigation } from '@/components/admin/AdminTopNavigation';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="glass-glee sticky top-0 z-50 border-b border-white/20">
        <AdminTopNavigation />
      </div>
      
      <main className="w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
}
