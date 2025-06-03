
import React from 'react';
import { AdminUnifiedHeader } from '@/components/admin/AdminUnifiedHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminUnifiedHeader />
      <main className="px-4 py-4 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
