
import React from 'react';
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { MobileAdminDashboard } from "@/components/admin/MobileAdminDashboard";
import { AdminLayout } from '@/layouts/AdminLayout';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AdminDashboard: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  console.log('🏛️ AdminDashboard: Rendering with mobile check:', { isMobile });

  return (
    <AdminLayout>
      <div className="w-full max-w-full overflow-x-hidden">
        {isMobile ? <MobileAdminDashboard /> : <AdminDashboardContent />}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
