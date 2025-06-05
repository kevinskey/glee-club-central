
import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;
