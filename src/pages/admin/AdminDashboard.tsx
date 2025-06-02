
import React from 'react';
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard: React.FC = () => {
  const isMobile = useIsMobile();
  
  console.log('🏛️ AdminDashboard: Component rendering, isMobile:', isMobile);

  return (
    <div className="flex-1 overflow-auto min-h-screen bg-background">
      <AdminDashboardContent isMobile={isMobile} />
    </div>
  );
};

export default AdminDashboard;
