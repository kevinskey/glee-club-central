
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface RoleBasedLayoutProps {
  requiredRole?: 'member' | 'admin';
  children?: React.ReactNode;
}

export const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ 
  requiredRole, 
  children 
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'member' && !['member', 'admin'].includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
