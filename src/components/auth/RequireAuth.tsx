
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/auth';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

const RequireAuth = ({ children, requireAdmin, allowedUserTypes }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isAdmin, getUserType } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access this page");
    }
  }, [isLoading, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store the current URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin()) {
    toast.error("You don't have admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user type is in allowed types
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = getUserType();
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default RequireAuth;
