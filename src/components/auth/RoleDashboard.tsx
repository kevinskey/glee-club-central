
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

// This component redirects users to the appropriate dashboard based on their role
const RoleDashboard = () => {
  const { profile, isLoading, getUserType, isAuthenticated } = useAuth();

  // Get user role from profile
  const userRole = profile?.role;
  const userType = getUserType();
  const isAdmin = profile?.is_super_admin;
  
  useEffect(() => {
    console.log("RoleDashboard - redirecting based on:", { 
      userRole, 
      userType, 
      isAdmin, 
      isAuthenticated,
      hasProfile: !!profile 
    });
  }, [userRole, userType, isAdmin, isAuthenticated, profile]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role - all authenticated users go to the main dashboard initially
  // The dashboard will handle showing admin vs member content based on permissions
  console.log("Redirecting authenticated user to main dashboard");
  return <Navigate to="/dashboard" replace />;
};

export default RoleDashboard;
