
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RoleDashboard() {
  const { profile, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Don't redirect if already redirected
    if (hasRedirected.current) {
      return;
    }

    // Don't redirect if still loading
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      hasRedirected.current = true;
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // Wait for profile to be fully loaded before redirecting
    if (!profile) {
      return;
    }

    // All conditions met - perform redirect based on role
    hasRedirected.current = true;
    
    // Single switch block for all role-based redirects
    const userRole = profile.role;
    const isAdmin = profile.is_super_admin || userRole === 'admin';
    
    switch (true) {
      case isAdmin:
        navigate('/admin', { replace: true });
        break;
      case userRole === 'member':
        navigate('/dashboard/member', { replace: true });
        break;
      default:
        // Default to member dashboard for all other users
        navigate('/dashboard/member', { replace: true });
        break;
    }
  }, [profile, isLoading, isAuthenticated, navigate, location]);

  // Reset redirect flag when leaving this component
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  // Show loading while determining role - don't render any layout to avoid flash
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

  // Return null after redirect to avoid any layout flash
  return null;
}
