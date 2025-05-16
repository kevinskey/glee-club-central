
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/auth';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

const RequireAuth = ({ children, requireAdmin, allowedUserTypes }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isAdmin, getUserType } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user type is in allowed types
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = getUserType();
    if (!userType || !allowedUserTypes.includes(userType)) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default RequireAuth;
