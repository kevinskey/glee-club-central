
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleLevels } from '@/hooks/useRoleLevels';
import { Spinner } from '@/components/ui/spinner';
import { UserLevel } from '@/types/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredLevel?: UserLevel;
}

export function ProtectedRoute({ children, adminOnly = false, requiredLevel }: ProtectedRouteProps) {
  // All hooks at the top
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const { getUserLevel } = useRoleLevels();
  const location = useLocation();
  
  const userLevel = getUserLevel();
  
  console.log('ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    adminOnly,
    userLevel,
    requiredLevel,
    isAdmin: isAdmin ? isAdmin() : false
  });
  
  // Using conditional rendering instead of early returns
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
  
  // Check for required user level
  if (requiredLevel) {
    // Check if user has required level or higher (admin > member > guest)
    const hasRequiredLevel = 
      (requiredLevel === 'guest') ||
      (requiredLevel === 'member' && (userLevel === 'member' || userLevel === 'admin')) ||
      (requiredLevel === 'admin' && userLevel === 'admin');
      
    if (!hasRequiredLevel) {
      console.log(`User does not have required level: ${requiredLevel}, redirecting`);
      
      // Redirect based on user's level
      if (userLevel === 'guest') {
        return <Navigate to="/dashboard/guest" state={{ accessDenied: true }} replace />;
      } else if (userLevel === 'member') {
        return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
      } else {
        return <Navigate to="/dashboard/admin" state={{ accessDenied: true }} replace />;
      }
    }
  }
  
  // Check if admin access is required
  if (adminOnly && isAdmin && !isAdmin()) {
    console.log('Admin only route, user is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
  }
  
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
}
