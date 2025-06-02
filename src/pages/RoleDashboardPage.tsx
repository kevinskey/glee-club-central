
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

const RoleDashboardPage = () => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, isAdmin } = useAuth();

  console.log('🏠 RoleDashboardPage: State check:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    isLoading,
    isInitialized,
    isAuthenticated,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    isAdminFunction: isAdmin()
  });

  if (!isInitialized) {
    return (
      <PageLoader 
        message="Starting GleeWorld..." 
        className="min-h-screen"
      />
    );
  }

  if (!isAuthenticated || !user) {
    console.log('🔒 RoleDashboardPage: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <PageLoader 
        message="Loading your profile..." 
        className="min-h-screen"
      />
    );
  }

  let redirectPath = '/dashboard/member';
  
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  const hasAdminAccess = isAdmin() || isKnownAdmin;
  
  if (hasAdminAccess) {
    redirectPath = '/admin';
    console.log('🎯 RoleDashboardPage: Admin user detected, redirecting to admin dashboard');
  } else if (profile?.role === 'fan') {
    redirectPath = '/dashboard/fan';
    console.log('🎯 RoleDashboardPage: Fan user detected, redirecting to fan dashboard');
  } else {
    console.log('🎯 RoleDashboardPage: Regular member, redirecting to member dashboard');
  }
  
  console.log('🎯 RoleDashboardPage: Redirecting to:', redirectPath);
  
  return <Navigate to={redirectPath} replace />;
};

export default RoleDashboardPage;
