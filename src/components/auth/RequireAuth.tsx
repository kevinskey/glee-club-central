
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Spinner } from '@/components/ui/spinner';
import { UserType } from '@/types/auth';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedUserTypes?: UserType[];
}

const RequireAuth = ({ children, requireAdmin, allowedUserTypes }: RequireAuthProps) => {
  const { isAuthenticated, isLoading: authLoading, isAdmin, getUserType } = useAuth();
  const { isSuperAdmin, isLoading: permissionsLoading } = usePermissions();
  const location = useLocation();
  
  const isLoading = authLoading || permissionsLoading;
  
  // Track redirect attempts to prevent loops
  const redirectAttemptedRef = React.useRef(false);
  const [hasShownError, setHasShownError] = React.useState(false);
  
  // Show loading state with timeout to prevent infinite loading
  const [showLoading, setShowLoading] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 200);
      
      // Auto-timeout after 10 seconds
      const timeoutTimer = setTimeout(() => {
        console.warn('Auth loading timeout - forcing completion');
        setShowLoading(false);
      }, 10000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(timeoutTimer);
      };
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);
  
  // Show error toast only once when not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasShownError && !location.pathname.includes('login')) {
      toast.error("Please log in to access this page");
      setHasShownError(true);
    }
  }, [isLoading, isAuthenticated, location.pathname, hasShownError]);
  
  // Show loading state
  if (showLoading && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Handle unauthenticated users
  if (!isAuthenticated && !isLoading && !redirectAttemptedRef.current) {
    redirectAttemptedRef.current = true;
    
    // Store the current URL to redirect back after login
    const currentPath = location.pathname + location.search;
    sessionStorage.setItem('authRedirectPath', currentPath);
    sessionStorage.setItem('authRedirectTimestamp', Date.now().toString());
    
    console.log("Redirecting to login from:", currentPath);
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && !isLoading && isAuthenticated) {
    const hasAdminAccess = isSuperAdmin || (isAdmin && isAdmin());
    if (!hasAdminAccess) {
      toast.error("You don't have admin privileges to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Check user type restrictions
  if (allowedUserTypes && allowedUserTypes.length > 0 && !isLoading && isAuthenticated) {
    const userType = getUserType();
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If still loading but we have a user, show the content to prevent blocking
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // Final fallback - should not reach here under normal circumstances
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default RequireAuth;
