
import React from 'react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

const RoleDashboardPage = () => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, isAdmin } = useSimpleAuthContext();

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

  // Determine redirect based on user type
  let redirectPath = '/dashboard/member'; // Default fallback
  
  // Check if user is kevinskey@mac.com (known admin)
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  const hasAdminAccess = isAdmin() || isKnownAdmin;
  
  if (hasAdminAccess) {
    redirectPath = '/dashboard/admin';
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
