
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTopNavigation } from './AdminTopNavigation';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNavigation />
      
      <main className="w-full">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
