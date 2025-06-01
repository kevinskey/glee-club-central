
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
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Loading dashboard..." 
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 RoleDashboardPage: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load before determining redirect
  if (!profile) {
    return (
      <PageLoader 
        message="Loading your profile..." 
        className="min-h-screen"
      />
    );
  }

  // Determine redirect based on user type
  const userType = getUserType();
  const redirectPath = userType === 'admin' ? '/dashboard/admin' : '/dashboard/member';
  
  console.log('🎯 RoleDashboardPage: Redirecting to:', redirectPath, 'for user type:', userType);
  
  return <Navigate to={redirectPath} replace />;
};

export default RoleDashboardPage;
