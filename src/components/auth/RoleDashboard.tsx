
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

  // Debug logging
  console.log('RoleDashboard state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isAdmin: profile?.is_super_admin,
    isLoading,
    isAuthenticated,
    hasRedirected: hasRedirected.current,
    profileWaitTime
  });

  // Track how long we've been waiting for profile
  useEffect(() => {
    if (user && !profile && !isLoading) {
      const timer = setInterval(() => {
        setProfileWaitTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [user, profile, isLoading]);

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

    // If profile hasn't loaded after 5 seconds, proceed with default role
    if (!profile && profileWaitTime >= 5) {
      console.log('Profile failed to load after 5 seconds, using default member role');
      hasRedirected.current = true;
      navigate('/dashboard/member', { replace: true });
      return;
    }

    // Wait for profile to be loaded (but not indefinitely)
    if (!profile && profileWaitTime < 5) {
      console.log('Profile not loaded yet, waiting... (' + profileWaitTime + 's)');
      return;
    }

    // All conditions met - perform role-based redirect
    hasRedirected.current = true;
    
    const userRole = profile?.role || 'member'; // Default to member if no role
    const isAdmin = profile?.is_super_admin || userRole === 'admin';
    
    console.log('Performing role-based redirect:', { userRole, isAdmin });
    
    switch (userRole) {
      case 'admin':
        console.log('Redirecting admin to /admin');
        navigate('/admin', { replace: true });
        break;
      case 'member':
        if (isAdmin) {
          console.log('Redirecting super admin to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Redirecting member to /dashboard/member');
          navigate('/dashboard/member', { replace: true });
        }
        break;
      case 'fan':
        console.log('Redirecting fan to /dashboard/fan');
        navigate('/dashboard/fan', { replace: true });
        break;
      default:
        // Default to member dashboard for unknown roles
        console.log('Unknown role, defaulting to member dashboard');
        navigate('/dashboard/member', { replace: true });
        break;
    }
  }, [user, profile, isLoading, isAuthenticated, navigate, location, profileWaitTime]);

  // Reset redirect flag when component unmounts
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  // Show different messages based on wait time
  const getLoadingMessage = () => {
    if (isLoading) return "Determining your dashboard access...";
    if (!profile && profileWaitTime < 3) return "Loading your profile...";
    if (!profile && profileWaitTime < 5) return "Still loading profile data...";
    return "Finalizing dashboard setup...";
  };

  // Show loading while determining role
  return (
    <PageLoader 
      message={getLoadingMessage()} 
      className="min-h-screen"
    />
  );
}
