
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// This component redirects to the proper admin dashboard
const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  
  // If user is admin, redirect to the real admin dashboard
  if (isAdmin && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  
  // If not admin, redirect to member dashboard
  return <Navigate to="/dashboard/member" replace />;
};

export default AdminDashboardPage;
