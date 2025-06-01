
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('🎯 RoleDashboard: Auth state check', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      userRole: profile?.role,
      isAdmin: isAdmin(),
      isInitialized,
      hasRedirected
    });

    // Wait for initialization and prevent multiple redirects
    if (!isInitialized || hasRedirected) {
      return;
    }

    // Handle unauthenticated users immediately
    if (!isAuthenticated || !user) {
      console.log('🚫 RoleDashboard: User not authenticated, redirecting to login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
      return;
    }

    // If user is authenticated but still loading profile, wait a bit
    if (isLoading && !profile) {
      console.log('⏳ RoleDashboard: Still loading profile...');
      return;
    }

    // After a reasonable timeout, proceed with default routing even if profile isn't loaded
    const timeoutId = setTimeout(() => {
      if (isAuthenticated && user && !hasRedirected) {
        console.log('⏰ RoleDashboard: Profile load timeout, using default routing');
        
        let targetRoute = '/dashboard/member'; // Default for authenticated users
        
        // Only check admin status if profile is loaded
        if (profile) {
          if (isAdmin()) {
            targetRoute = '/admin';
            console.log('👑 RoleDashboard: Admin user, redirecting to admin dashboard');
          } else if (profile.role === 'fan') {
            targetRoute = '/fan-dashboard';
            console.log('👤 RoleDashboard: Fan user, redirecting to fan dashboard');
          } else {
            console.log('👤 RoleDashboard: Member user, redirecting to member dashboard');
          }
        } else {
          console.log('👤 RoleDashboard: No profile loaded, defaulting to member dashboard');
        }
        
        console.log('🎯 RoleDashboard: Redirecting to:', targetRoute);
        setHasRedirected(true);
        navigate(targetRoute, { replace: true });
      }
    }, 3000); // 3 second timeout

    // If we have both user and profile, redirect immediately
    if (isAuthenticated && user && profile && !hasRedirected) {
      clearTimeout(timeoutId);
      
      let targetRoute = '/dashboard/member';
      
      if (isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin user detected');
      } else if (profile.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('👤 RoleDashboard: Fan user detected');
      } else {
        console.log('👤 RoleDashboard: Member user detected');
      }
      
      console.log('🎯 RoleDashboard: Immediate redirect to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected]);

  // Show appropriate loading states
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Initializing..."
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
