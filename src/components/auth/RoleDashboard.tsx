
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function RoleDashboard() {
  const { user, profile, isLoading, isAuthenticated } = useAuth();
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
    isLoading,
    isAuthenticated,
    hasRedirected: hasRedirected.current,
    redirectTimeout
  });

  // Set a timeout for redirection - don't wait forever
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirectTimeout(true);
    }, 3000); // 3 second timeout for faster redirect
    
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
      navigate('/auth/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // If timeout reached or profile loaded, proceed with redirect
    if (redirectTimeout || profile) {
      hasRedirected.current = true;
      
      const userRole = profile?.role || 'member';
      const isAdmin = profile?.is_super_admin || userRole === 'admin';
      
      console.log('Performing role-based redirect:', { userRole, isAdmin, hasProfile: !!profile });
      
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
  }, [user, profile, isLoading, isAuthenticated, navigate, location, redirectTimeout]);

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
