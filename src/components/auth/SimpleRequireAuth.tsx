
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { toast } from 'sonner';

interface SimpleRequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const SimpleRequireAuth = ({ children, requireAdmin = false }: SimpleRequireAuthProps) => {
  const { isAuthenticated, isLoading, isInitialized, profile, isAdmin } = useSimpleAuthContext();
  const location = useLocation();
  
  console.log('🔐 SimpleRequireAuth: State check:', {
    isAuthenticated,
    isLoading,
    isInitialized,
    requireAdmin,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    location: location.pathname
  });

  // Show loading during initialization
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Authenticating..." 
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 SimpleRequireAuth: Not authenticated, redirecting to login');
    toast.error("Please log in to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin) {
    // Wait for profile to load before checking admin status
    if (!profile) {
      return (
        <PageLoader 
          message="Verifying permissions..." 
          className="min-h-screen"
        />
      );
    }

    const hasAdminAccess = isAdmin();
    
    console.log('👑 SimpleRequireAuth: Admin check:', {
      hasAdminAccess,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin
    });
    
    if (!hasAdminAccess) {
      console.log('❌ SimpleRequireAuth: User lacks admin access, redirecting');
      toast.error("You don't have admin privileges to access this page");
      return <Navigate to="/dashboard/member" replace />;
    }
  }

  // All checks passed, render children
  console.log('✅ SimpleRequireAuth: Access granted, rendering children');
  return <>{children}</>;
};

export default SimpleRequireAuth;
