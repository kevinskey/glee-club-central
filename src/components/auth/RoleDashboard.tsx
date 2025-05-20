
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const RoleDashboard = () => {
  const { isAuthenticated, isLoading, getUserType } = useAuth();
  const navigate = useNavigate();
  
  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error("Please log in to access the dashboard");
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
      // If user type is not set, show an error and redirect to login
      toast.error("User role not recognized. Please contact support.");
      return <Navigate to="/login" replace />;
  }
};

export default RoleDashboard;
