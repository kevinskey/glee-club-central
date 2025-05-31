
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
  
  // Track redirect state to prevent multiple redirects and reduce blinking
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const redirectAttemptedRef = React.useRef(false);
  const [showLoading, setShowLoading] = React.useState(false);
  
  // Debounce loading display to prevent blinking
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 100); // Reduced delay to minimize perceived lag
      
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);
  
  // Show toast only once per session and only when not loading
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !location.pathname.includes('login') && !isRedirecting && !redirectAttemptedRef.current) {
      toast.error("Please log in to access this page");
    }
  }, [isLoading, isAuthenticated, location.pathname, isRedirecting]);
  
  // Show loading state with consistent styling
  if (showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm animate-pulse">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Only redirect once and avoid multiple redirects
  if (!isAuthenticated && !isRedirecting && !redirectAttemptedRef.current && !isLoading) {
    // Prevent multiple redirects by setting refs and state
    setIsRedirecting(true);
    redirectAttemptedRef.current = true;
    
    // Store the current URL to redirect back after login
    const currentPath = location.pathname;
    sessionStorage.setItem('authRedirectPath', currentPath);
    
    // For recording-specific paths, set an intent parameter
    if (location.pathname.includes('recording')) {
      sessionStorage.setItem('authRedirectIntent', 'recording');
    }
    
    // Add a timestamp to prevent stale redirects
    sessionStorage.setItem('authRedirectTimestamp', Date.now().toString());
    
    console.log("Redirecting to login from:", currentPath);
    return <Navigate to="/login" replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isLoading) {
    const hasAdminAccess = isSuperAdmin || (isAdmin && isAdmin());
    if (!hasAdminAccess) {
      toast.error("You don't have admin privileges to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Check if user type is in allowed types
  if (allowedUserTypes && allowedUserTypes.length > 0 && !isLoading) {
    const userType = getUserType();
    
    if (!userType || !allowedUserTypes.includes(userType)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Authentication passed, render children
  return <>{children}</>;
};

export default RequireAuth;
