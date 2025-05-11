
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { Spinner } from '@/components/ui/spinner';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'admin' | 'section_leader' | 'staff';
}

export function PermissionGuard({ 
  children, 
  requiredPermission,
  requiredRole
}: PermissionGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasPermission, userRole, isLoading: permissionsLoading } = useRolePermissions();
  const location = useLocation();
  
  const isLoading = authLoading || permissionsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check for required role
  if (requiredRole && userRole !== 'admin') {
    if (userRole !== requiredRole) {
      return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
    }
  }
  
  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }
  
  return <>{children}</>;
}
