
import React from 'react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

const RoleDashboardPage = () => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, getUserType } = useSimpleAuthContext();

  console.log('🏠 RoleDashboardPage: State check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    isInitialized,
    isAuthenticated,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin
  });

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Starting GleeWorld..." 
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔒 RoleDashboardPage: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Show loading while profile loads
  if (isLoading) {
    return (
      <PageLoader 
        message="Loading your profile..." 
        className="min-h-screen"
      />
    );
  }

  // Determine redirect based on user type - with fallback
  let redirectPath = '/dashboard/member'; // Default fallback
  
  if (profile?.is_super_admin === true || profile?.role === 'admin') {
    redirectPath = '/dashboard/admin';
    console.log('🎯 RoleDashboardPage: Admin user detected, redirecting to admin dashboard');
  } else {
    console.log('🎯 RoleDashboardPage: Regular user, redirecting to member dashboard');
  }
  
  console.log('🎯 RoleDashboardPage: Redirecting to:', redirectPath);
  
  return <Navigate to={redirectPath} replace />;
};

export default RoleDashboardPage;
