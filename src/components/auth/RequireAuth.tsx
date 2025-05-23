
import * as React from 'react';
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
  
  // Track redirect state to prevent multiple redirects
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  
  // Show toast only once per session and only when not loading
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !location.pathname.includes('login') && !isRedirecting) {
      toast.error("Please log in to access this page");
    }
  }, [isLoading, isAuthenticated, location.pathname, isRedirecting]);
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Only redirect once and avoid multiple redirects
  if (!isAuthenticated && !isRedirecting) {
    // Prevent multiple redirects by setting state
    setIsRedirecting(true);
    
    // Store the current URL to redirect back after login
    const searchParams = new URLSearchParams();
    searchParams.set('returnTo', location.pathname);
    
    // For recording-specific paths, set an intent parameter
    if (location.pathname.includes('recording')) {
      searchParams.set('intent', 'recording');
    }
    
    return <Navigate to={`/login?${searchParams.toString()}`} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin()) {
    toast.error("You don't have admin privileges to access this page");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user type is in allowed types
  if (allowedUserTypes && allowedUserTypes.length > 0) {
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
