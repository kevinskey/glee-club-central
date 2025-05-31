
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

    // Wait for initialization
    if (!isInitialized || hasRedirected) {
      return;
    }

    // Wait for loading to complete
    if (isLoading) {
      return;
    }

    // Handle unauthenticated users
    if (!isAuthenticated || !user) {
      console.log('RoleDashboard: User not authenticated, redirecting to login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
      return;
    }

    // Handle authenticated users - simplified routing
    if (isAuthenticated && user) {
      console.log('RoleDashboard: User authenticated, determining route...');
      
      let targetRoute = '/dashboard/member'; // Default route
      
      if (isAdmin()) {
        targetRoute = '/admin';
      } else if (profile?.role === 'fan') {
        targetRoute = '/fan-dashboard';
      }
      
      console.log('RoleDashboard: Redirecting to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected]);

  // Show loading states with clearer messaging
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
        message="Loading your profile..."
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

  return (
    <PageLoader 
      message="Loading your dashboard..." 
      className="min-h-screen"
    />
  );
};

export default RoleDashboard;
