
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RoleDashboard() {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && profile) {
      // Determine redirect based on user role/type
      if (profile.role === 'admin' || profile.is_super_admin) {
        navigate('/admin', { replace: true });
      } else if (profile.user_type === 'fan' as any) {
        navigate('/fan-dashboard', { replace: true });
      } else {
        // Default to member dashboard for regular members
        navigate('/dashboard/member', { replace: true });
      }
    } else if (!isLoading && !profile) {
      // If no profile and not loading, redirect to login
      navigate('/login', { 
        replace: true,
        state: { from: location }
      });
    }
  }, [profile, isLoading, navigate, location]);

  // Show loading while determining role
  if (isLoading) {
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
