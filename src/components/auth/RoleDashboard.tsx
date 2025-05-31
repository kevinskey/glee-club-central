
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function RoleDashboard() {
  const { user, profile, isLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const [redirectTimeout, setRedirectTimeout] = useState(false);

  // Debug logging
  console.log('RoleDashboard state:', {
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    isAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin ? isAdmin() : false,
    userEmail: user?.email,
    userMetadata: user?.user_metadata,
    appMetadata: user?.app_metadata,
    isLoading,
    isAuthenticated,
    hasRedirected: hasRedirected.current,
    redirectTimeout
  });

  // Set a timeout for redirection - don't wait forever
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirectTimeout(true);
    }, 2000); // Reduced to 2 seconds for faster redirect
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) {
      console.log('Already redirected, skipping');
      return;
    }

    // Wait for auth to be settled (but not too long)
    if (isLoading && !redirectTimeout) {
      console.log('Still loading auth state, waiting...');
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      console.log('Not authenticated, redirecting to login');
      hasRedirected.current = true;
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // If timeout reached or profile loaded, proceed with redirect
    if (redirectTimeout || profile) {
      hasRedirected.current = true;
      
      // Enhanced admin detection with multiple fallbacks
      const isAdminUser = 
        // Primary: Profile-based detection
        profile?.is_super_admin === true || 
        profile?.role === 'admin' ||
        // Secondary: isAdmin function (includes metadata fallback)
        (isAdmin && isAdmin()) ||
        // Tertiary: Direct user metadata check
        user?.user_metadata?.role === 'admin' ||
        user?.app_metadata?.role === 'admin' ||
        user?.user_metadata?.role === 'super_admin' ||
        user?.app_metadata?.role === 'super_admin';
      
      const userRole = profile?.role || 'member';
      
      console.log('Performing role-based redirect:', { 
        userRole, 
        isAdminUser, 
        hasProfile: !!profile,
        profileIsSuperAdmin: profile?.is_super_admin,
        profileRole: profile?.role,
        isAdminFunction: isAdmin ? isAdmin() : false,
        userMetadataRole: user?.user_metadata?.role,
        appMetadataRole: user?.app_metadata?.role
      });
      
      if (isAdminUser) {
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
  }, [user, profile, isLoading, isAuthenticated, navigate, location, redirectTimeout, isAdmin]);

  // Reset redirect flag when component unmounts
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  // Show different messages based on state
  const getLoadingMessage = () => {
    if (isLoading && !redirectTimeout) return "Determining your dashboard access...";
    if (!profile && !redirectTimeout) return "Loading your profile...";
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
