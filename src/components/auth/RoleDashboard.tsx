
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

const RoleDashboard = () => {
  const { isAuthenticated, isLoading, getUserType } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check user type and redirect accordingly
  const userType = getUserType();
  
  switch (userType) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'member':
      return <Navigate to="/dashboard/member" replace />;
    case 'fan':
      return <Navigate to="/dashboard/fan" replace />;
    default:
      // If user type is not set, default to fan access level
      return <Navigate to="/dashboard/fan" replace />;
  }
};

export default RoleDashboard;
