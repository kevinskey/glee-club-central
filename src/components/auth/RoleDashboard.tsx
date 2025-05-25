
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/auth';

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

  // Redirect based on role - prioritize admin status first
  if (isAdmin || userRole === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (userRole === 'member' || userType === 'member') {
    return <Navigate to="/dashboard/member" replace />;
  } else if (userRole === 'fan' || userType === 'fan') {
    return <Navigate to="/dashboard/fan" replace />;
  }

  // Default to member dashboard for authenticated users
  return <Navigate to="/dashboard/member" replace />;
};

export default RoleDashboard;
