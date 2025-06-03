
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DynamicDashboardSidebar } from '@/components/dashboard/DynamicDashboardSidebar';
import { MobileDashboardSidebar, MobileDashboardSidebarTrigger } from '@/components/dashboard/MobileDashboardSidebar';

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      {isDesktop && <DynamicDashboardSidebar />}
      
      {/* Mobile Sidebar */}
      {!isDesktop && (
        <MobileDashboardSidebar 
          open={mobileMenuOpen} 
          onOpenChange={setMobileMenuOpen} 
        />
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${isDesktop ? 'ml-64' : 'ml-0'} min-h-screen`}>
        {/* Mobile Header with Trigger */}
        {!isDesktop && (
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Glee Dashboard
              </h1>
              <MobileDashboardSidebarTrigger onOpen={() => setMobileMenuOpen(true)} />
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
