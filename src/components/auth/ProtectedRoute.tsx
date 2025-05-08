
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();
  
  console.log("Protected Route - Auth Status:", { isAuthenticated, isLoading, currentPath: location.pathname });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    // Save the location the user was trying to access and redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check for required roles if specified
  if (requiredRoles?.length && profile?.role) {
    const hasRequiredRole = requiredRoles.includes(profile.role);
    if (!hasRequiredRole) {
      console.log("Missing required role, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  console.log("Authentication passed, rendering protected content");
  return <>{children}</>;
}
