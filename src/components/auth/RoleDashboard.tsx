
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

// This component redirects users to the appropriate dashboard based on their role
const RoleDashboard = () => {
  const { profile, isLoading, getUserType } = useAuth();

  // Get user role from profile
  const userRole = profile?.role;
  const userType = getUserType();
  const isAdmin = profile?.is_super_admin;
  
  useEffect(() => {
    console.log("RoleDashboard - redirecting based on:", { userRole, userType, isAdmin });
  }, [userRole, userType, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect based on role - admins go to admin dashboard, everyone else goes to member dashboard
  if (isAdmin || userRole === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else {
    // All non-admin users go to the member dashboard
    return <Navigate to="/dashboard/member" replace />;
  }
};

export default RoleDashboard;
