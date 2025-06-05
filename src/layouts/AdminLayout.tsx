
import React from 'react';
import { AdminUnifiedHeader } from '@/components/admin/AdminUnifiedHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-w-full overflow-x-hidden">
      <AdminUnifiedHeader />
      <main className="w-full max-w-full overflow-x-hidden">
        <div className={`w-full mx-auto px-4 py-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
