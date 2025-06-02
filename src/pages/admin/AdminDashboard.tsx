
import React from 'react';
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { AdminLayout } from '@/layouts/AdminLayout';

const AdminDashboard: React.FC = () => {
  console.log('🏛️ AdminDashboard: Component rendering with new layout');

  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;
