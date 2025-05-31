
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('RoleDashboard: Auth state check', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      userRole: profile?.role,
      isAdmin: isAdmin(),
      isInitialized,
      hasRedirected
    });

    // Only proceed if auth is initialized and we haven't redirected yet
    if (!isInitialized || hasRedirected) {
      console.log('RoleDashboard: Not initialized or already redirected');
      return;
    }

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

    // Handle authenticated users - redirect based on role
    if (isAuthenticated && user) {
      console.log('RoleDashboard: User authenticated, determining route...');
      
      let targetRoute = '/dashboard/member'; // Default route
      
      // Determine route based on role
      if (isAdmin()) {
        targetRoute = '/admin';
        console.log('RoleDashboard: Routing admin user to admin dashboard');
      } else if (profile?.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('RoleDashboard: Routing fan user to fan dashboard');
      } else {
        targetRoute = '/dashboard/member';
        console.log('RoleDashboard: Routing member user to member dashboard');
      }
      
      console.log('RoleDashboard: Final redirect to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected]);

  // Show loading state
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Initializing authentication..."
        className="min-h-screen"
      />
    );
  }

  if (isLoading) {
    return (
      <PageLoader 
        message="Verifying your credentials..."
        className="min-h-screen"
      />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <PageLoader 
        message="Redirecting to login..."
        className="min-h-screen"
      />
    );
  }

  if (isAuthenticated && user && !hasRedirected) {
    return (
      <PageLoader 
        message="Determining your access level..."
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
