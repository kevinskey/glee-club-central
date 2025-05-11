
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { PermissionName } from '@/types/permissions';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionName;
  requireSuperAdmin?: boolean;
}

export function PermissionRoute({ 
  children, 
  requiredPermission,
  requireSuperAdmin = false
}: PermissionRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, profile } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const location = useLocation();
  
  console.log('PermissionRoute check:', { 
    path: location.pathname,
    isAuthenticated, 
    isLoading,
    isAdmin: isAdmin ? isAdmin() : false,
    isSuperAdmin,
    requireSuperAdmin,
    requiredPermission,
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
  
  // If the user is a superadmin or has admin role, always allow access
  if (isSuperAdmin || (isAdmin && isAdmin())) {
    console.log('Access granted: User is super admin or admin');
    return <>{children}</>;
  }
  
  // Check for super admin requirement when user isn't admin
  if (requireSuperAdmin) {
    console.log('Access denied: User is not super admin or admin');
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }
  
  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log(`Access denied: Missing permission: ${requiredPermission}`);
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }
  
  return <>{children}</>;
}
