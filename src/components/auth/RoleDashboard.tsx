
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RoleDashboard() {
  const { profile, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const redirectTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any pending redirects
    if (redirectTimeout.current) {
      clearTimeout(redirectTimeout.current);
    }

    // Don't redirect if already redirected or still loading
    if (hasRedirected.current || isLoading) {
      return;
    }

    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      hasRedirected.current = true;
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // If authenticated but no profile yet, wait a bit longer
    if (isAuthenticated && !profile) {
      return;
    }

    // Debounce the redirect to prevent rapid state changes
    redirectTimeout.current = setTimeout(() => {
      if (hasRedirected.current) return;

      if (profile) {
        hasRedirected.current = true;
        
        // Determine redirect based on user role/type
        if (profile.role === 'admin' || profile.is_super_admin) {
          navigate('/admin', { replace: true });
        } else if (profile.user_type === 'fan' as any) {
          navigate('/fan-dashboard', { replace: true });
        } else {
          // Default to member dashboard for regular members
          navigate('/dashboard/member', { replace: true });
        }
      }
    }, 100); // Small delay to prevent rapid redirects

    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [profile, isLoading, isAuthenticated, navigate, location]);

  // Reset redirect flag when component unmounts or location changes significantly
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, [location.pathname]);

  // Show loading while determining role
  if (isLoading || !hasRedirected.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
