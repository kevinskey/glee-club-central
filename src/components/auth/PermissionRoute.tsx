
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface PermissionRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export function PermissionRoute({ 
  children, 
  requireSuperAdmin = false
}: PermissionRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, profile } = useAuth();
  const location = useLocation();
  
  console.log('PermissionRoute check:', { 
    path: location.pathname,
    isAuthenticated, 
    isLoading,
    isAdmin: isAdmin ? isAdmin() : false,
    isSuperAdmin: profile?.is_super_admin,
    requireSuperAdmin,
    userProfile: profile,
  });
  
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
  
  // If the user is a superadmin, always allow access
  if (profile?.is_super_admin) {
    console.log('Access granted: User is super admin');
    return <>{children}</>;
  }
  
  // Check for super admin requirement
  if (requireSuperAdmin && !profile?.is_super_admin) {
    console.log('Access denied: User is not super admin');
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }
  
  return <>{children}</>;
}
