
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

const RoleDashboardPage = () => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, isAdmin } = useAuth();

  console.log('🏠 RoleDashboardPage: DASHBOARD ASSIGNMENT STATE:', {
    hasUser: !!user,
    userEmail: user?.email,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileIsAdmin: profile?.is_super_admin,
    isLoading,
    isInitialized,
    isAuthenticated,
    isAdminFunction: isAdmin(),
    timestamp: new Date().toISOString()
  });

  // Wait for initialization
  if (!isInitialized) {
    console.log('⏳ RoleDashboardPage: Waiting for auth initialization...');
    return (
      <PageLoader 
        message="Starting GleeWorld..." 
        className="min-h-screen"
      />
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    console.log('🔒 RoleDashboardPage: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wait for profile loading
  if (isLoading) {
    console.log('⏳ RoleDashboardPage: Loading user profile...');
    return (
      <PageLoader 
        message="Loading your profile..." 
        className="min-h-screen"
      />
    );
  }

  // Determine dashboard assignment
  let redirectPath = '/dashboard/member'; // Default fallback
  let assignmentReason = 'default member assignment';
  
  // Check for admin access
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  const hasAdminAccess = isAdmin() || isKnownAdmin;
  
  if (hasAdminAccess) {
    redirectPath = '/admin';
    assignmentReason = `admin access (isAdmin: ${isAdmin()}, knownAdmin: ${isKnownAdmin})`;
  } else if (profile?.role === 'fan') {
    redirectPath = '/dashboard/fan';
    assignmentReason = 'fan role detected';
  } else {
    assignmentReason = `member role (role: ${profile?.role || 'undefined'})`;
  }
  
  console.log('🎯 RoleDashboardPage: DASHBOARD ASSIGNMENT DECISION:', {
    finalPath: redirectPath,
    reason: assignmentReason,
    userEmail: user.email,
    profileRole: profile?.role,
    isAdminResult: isAdmin(),
    isKnownAdmin,
    hasAdminAccess,
    timestamp: new Date().toISOString()
  });
  
  return <Navigate to={redirectPath} replace />;
};

export default RoleDashboardPage;
