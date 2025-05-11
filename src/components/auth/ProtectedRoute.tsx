
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin access is required
  if (adminOnly && !isAdmin()) {
    console.log('Admin only route, user is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
  }
  
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
}
