
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { PageLoader } from '@/components/ui/page-loader';
import { UserType } from '@/types/auth';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

const RequireAuth = ({ children, requireAdmin, allowedUserTypes }: RequireAuthProps) => {
  const { isAuthenticated, isLoading: authLoading, isAdmin, getUserType, user, profile } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  const location = useLocation();
  
  const isLoading = authLoading;
  
  // Track redirect attempts to prevent loops
  const redirectAttemptedRef = React.useRef(false);
  
  // Debug logging
  console.log('RequireAuth state:', {
    isAuthenticated,
    isLoading,
    authLoading,
    permissionsLoading,
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    requireAdmin,
    allowedUserTypes,
    location: location.pathname
  });
  
  // Show loading state while auth is being determined
  if (isLoading) {
    console.log('RequireAuth: Still loading, showing loader');
    return (
      <PageLoader 
        message="Verifying authentication..." 
        className="min-h-screen"
      />
    );
  }
  
  // Handle unauthenticated users
  if (!isAuthenticated && !redirectAttemptedRef.current) {
    redirectAttemptedRef.current = true;
    
    // Store the current URL to redirect back after login
    const currentPath = location.pathname + location.search;
    sessionStorage.setItem('authRedirectPath', currentPath);
    
    console.log("RequireAuth: Redirecting to login from:", currentPath);
    toast.error("Please log in to access this page");
    return <Navigate to="/auth/login" replace />;
  }
  
  // Check admin access if required (only if we have profile data or timeout)
  if (requireAdmin && isAuthenticated) {
    const hasAdminAccess = isSuperAdmin || 
                          profile?.is_super_admin === true || 
                          profile?.role === 'admin' ||
                          (isAdmin && isAdmin());
    
    console.log('RequireAuth: Admin check:', { hasAdminAccess, isSuperAdmin, profileIsAdmin: profile?.is_super_admin });
    
    if (!hasAdminAccess && profile) { // Only block if we have profile data
      console.log('RequireAuth: User lacks admin access, redirecting to dashboard');
      toast.error("You don't have admin privileges to access this page");
      return <Navigate to="/dashboard/member" replace />;
    }
  }
  
  // Check user type restrictions (only if we have profile data)
  if (allowedUserTypes && allowedUserTypes.length > 0 && isAuthenticated && profile) {
    const userType = getUserType();
    
    console.log('RequireAuth: User type check:', { userType, allowedUserTypes });
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      console.log('RequireAuth: User type not allowed, redirecting to dashboard');
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard/member" replace />;
    }
  }
  
  // If authenticated and all checks pass, render children
  if (isAuthenticated) {
    console.log('RequireAuth: All checks passed, rendering children');
    return <>{children}</>;
  }
  
  // Final fallback loader
  console.log('RequireAuth: Fallback loader');
  return (
    <PageLoader 
      message="Loading..." 
      className="min-h-screen"
    />
  );
};

export default RequireAuth;
