
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading, isAdmin } = useSimpleAuthContext();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading state while checking auth
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and has admin privileges if required)
  return <>{children}</>;
};

export default ProtectedRoute;
