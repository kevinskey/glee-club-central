
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/auth';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

const RequireAuth = ({ children, requireAdmin, allowedUserTypes }: RequireAuthProps) => {
  const { isAuthenticated, isLoading, isAdmin, getUserType } = useAuth();
  const location = useLocation();
  
  // Add debug logging
  console.log(`RequireAuth check: isAuthenticated=${isAuthenticated}, isLoading=${isLoading}, path=${location.pathname}`);
  
  useEffect(() => {
    // Only show error toast if authentication check has completed
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access this page");
    }
  }, [isLoading, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login with returnTo:", location.pathname);
    
    // Store the current URL to redirect back after login
    const searchParams = new URLSearchParams();
    searchParams.set('returnTo', location.pathname);
    
    // For recording-specific paths, set an intent parameter
    if (location.pathname.includes('recording')) {
      searchParams.set('intent', 'recording');
      console.log("Setting recording intent for redirect");
    }
    
    return <Navigate to={`/login?${searchParams.toString()}`} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin()) {
    console.log("Admin access required but user is not admin");
    toast.error("You don't have admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user type is in allowed types
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    const userType = getUserType();
    console.log("Checking allowed user types:", allowedUserTypes, "Current user type:", userType);
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  console.log("Auth check passed, rendering children");
  return <>{children}</>;
};

export default RequireAuth;
