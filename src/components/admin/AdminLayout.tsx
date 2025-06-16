
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminUnifiedHeader } from './AdminUnifiedHeader';
import { AdminSidebar } from './AdminSidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminUnifiedHeader />
      
      <div className="flex">
        {!isMobile && <AdminSidebar />}
        
        <main className={`flex-1 min-h-[calc(100vh-5rem)] admin-main ${!isMobile ? 'ml-64' : ''}`}>
          <div className={isMobile ? 'p-4' : 'p-6'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
