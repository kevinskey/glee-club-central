
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { toast } from 'sonner';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only proceed if auth is initialized and we haven't redirected yet
    if (!isInitialized || hasRedirected) return;

    console.log('RoleDashboard: Auth state check', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      userRole: profile?.role,
      isAdmin: isAdmin(),
      isInitialized
    });

    // Wait for loading to complete
    if (isLoading) {
      console.log('RoleDashboard: Still loading, waiting...');
      return;
    }

    // Handle unauthenticated users
    if (!isAuthenticated || !user) {
      console.log('RoleDashboard: User not authenticated, redirecting to login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
      return;
    }

    // Handle authenticated users
    if (isAuthenticated && user) {
      console.log('RoleDashboard: Determining user role for routing');
      console.log('User:', user);
      console.log('Profile:', profile);
      console.log('Is Admin:', isAdmin());
      
      let targetRoute = '/dashboard/member'; // Default route
      
      // Determine route based on role
      if (isAdmin()) {
        targetRoute = '/admin';
        console.log('RoleDashboard: Routing admin to admin dashboard');
      } else if (profile?.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('RoleDashboard: Routing fan to fan dashboard');
      } else {
        targetRoute = '/dashboard/member';
        console.log('RoleDashboard: Routing member to member dashboard');
      }
      
      console.log('RoleDashboard: Redirecting to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected]);

  // Show loading state
  if (!isInitialized || isLoading || !hasRedirected) {
    let message = "Loading...";
    
    if (!isInitialized) {
      message = "Initializing authentication...";
    } else if (isLoading) {
      message = "Verifying your credentials...";
    } else if (isAuthenticated && user) {
      message = "Determining your access level...";
    } else {
      message = "Redirecting to login...";
    }
    
    return (
      <PageLoader 
        message={message}
        className="min-h-screen"
      />
    );
  }

  // Fallback loader while routing completes
  return (
    <PageLoader 
      message="Loading your dashboard..." 
      className="min-h-screen"
    />
  );
};

export default RoleDashboard;
