
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <main className={`flex-1 min-h-screen ${!isMobile ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
