
import React from 'react';
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";

const AdminDashboard: React.FC = () => {
  console.log('🏛️ AdminDashboard: Component rendering');

  return (
    <div className="flex-1 overflow-auto">
      <AdminDashboardContent />
    </div>
  );
};

export default AdminDashboard;
