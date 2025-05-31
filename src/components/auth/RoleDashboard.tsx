
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function RoleDashboard() {
  const { user, profile, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const [profileWaitTime, setProfileWaitTime] = useState(0);
  const [maxWaitReached, setMaxWaitReached] = useState(false);

  // Debug logging
  console.log('RoleDashboard state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isAdmin: profile?.is_super_admin,
    isLoading,
    isAuthenticated,
    hasRedirected: hasRedirected.current,
    profileWaitTime,
    maxWaitReached
  });

  // Track how long we've been waiting for profile
  useEffect(() => {
    if (user && !profile && !isLoading && !maxWaitReached) {
      const timer = setInterval(() => {
        setProfileWaitTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 3) {
            setMaxWaitReached(true);
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [user, profile, isLoading, maxWaitReached]);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) {
      console.log('Already redirected, skipping');
      return;
    }

    // Wait for auth to be settled
    if (isLoading) {
      console.log('Still loading auth state');
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      console.log('Not authenticated, redirecting to login');
      hasRedirected.current = true;
      navigate('/auth/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // If profile hasn't loaded after max wait time, proceed with fallback
    if (!profile && maxWaitReached) {
      console.log('Profile failed to load within timeout, using fallback member role');
      hasRedirected.current = true;
      navigate('/dashboard/member', { replace: true });
      return;
    }

    // Wait for profile to be loaded (but not indefinitely)
    if (!profile && !maxWaitReached) {
      console.log('Profile not loaded yet, waiting... (' + profileWaitTime + 's)');
      return;
    }

    // All conditions met - perform role-based redirect
    if (profile) {
      hasRedirected.current = true;
      
      const userRole = profile.role || 'member';
      const isAdmin = profile.is_super_admin || userRole === 'admin';
      
      console.log('Performing role-based redirect:', { userRole, isAdmin });
      
      if (isAdmin || userRole === 'admin') {
        console.log('Redirecting admin to /admin');
        navigate('/admin', { replace: true });
      } else if (userRole === 'fan') {
        console.log('Redirecting fan to /dashboard/fan');
        navigate('/dashboard/fan', { replace: true });
      } else {
        console.log('Redirecting member to /dashboard/member');
        navigate('/dashboard/member', { replace: true });
      }
    }
  }, [user, profile, isLoading, isAuthenticated, navigate, location, maxWaitReached, profileWaitTime]);

  // Reset redirect flag when component unmounts
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  // Show different messages based on wait time
  const getLoadingMessage = () => {
    if (isLoading) return "Determining your dashboard access...";
    if (!profile && profileWaitTime < 2) return "Loading your profile...";
    if (!profile && profileWaitTime < 3) return "Still loading profile data...";
    if (!profile && maxWaitReached) return "Finalizing dashboard setup...";
    return "Redirecting to your dashboard...";
  };

  // Show loading while determining role
  return (
    <PageLoader 
      message={getLoadingMessage()} 
      className="min-h-screen"
    />
  );
}
