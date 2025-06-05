
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PageLoader } from '@/components/ui/page-loader';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay to ensure the redirect works properly
    const timer = setTimeout(() => {
      navigate('/admin/v2', { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader message="Redirecting to admin dashboard..." />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
