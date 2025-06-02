
import React, { useState } from 'react';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminMobileSidebar } from "@/components/admin/AdminMobileSidebar";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard: React.FC = () => {
  console.log('🏛️ AdminDashboard: Component rendering started');
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('🏛️ AdminDashboard: Render details:', {
    isMobile,
    sidebarOpen,
    timestamp: new Date().toISOString()
  });

  try {
    console.log('🏛️ AdminDashboard: Attempting to render layout...');
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminTopBar />
              <main className="flex-1 overflow-auto">
                <AdminDashboardContent />
              </main>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="min-h-screen">
            <AdminTopBar 
              onMenuClick={() => setSidebarOpen(true)}
              isMobile={true}
            />
            <AdminMobileSidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="pt-16">
              <AdminDashboardContent isMobile={true} />
            </main>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('💥 AdminDashboard: Error during render:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600">There was an error loading the admin dashboard.</p>
          <p className="text-sm text-gray-500 mt-2">Check the console for details.</p>
        </div>
      </div>
    );
  }
};

export default AdminDashboard;
