
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

// This component redirects users to the appropriate dashboard based on their role
const RoleDashboard = () => {
  const { profile, isLoading } = useAuth();

  // Get user role from profile
  const userRole = profile?.role;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect based on role
  if (userRole === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (userRole === 'member') {
    return <Navigate to="/dashboard" replace />;
  } else if (userRole === 'fan') {
    return <Navigate to="/dashboard/fan" replace />;
  }

  // Default to main dashboard
  return <Navigate to="/dashboard" replace />;
};

export default RoleDashboard;
