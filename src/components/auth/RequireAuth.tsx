
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const RequireAuth = ({ children, requiredRole }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
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
  if (requiredRole === "admin" && isAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default RequireAuth;
