
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageLoader } from '@/components/ui/page-loader';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new v2 admin dashboard
    navigate('/admin/v2', { replace: true });
  }, [navigate]);

  return (
    <AdminLayout>
      <PageLoader message="Loading admin dashboard..." />
    </AdminLayout>
  );
};

export default AdminDashboard;
