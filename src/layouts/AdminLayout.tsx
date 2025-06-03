
import React from 'react';
import { AdminUnifiedHeader } from '@/components/admin/AdminUnifiedHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-w-full overflow-x-hidden">
      <AdminUnifiedHeader />
      <main className="w-full max-w-full px-4 py-2 mx-auto overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
