
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

  // Wait for initialization - this should complete quickly
  if (!isInitialized) {
    console.log('⏳ RoleDashboardPage: Waiting for auth initialization...');
    return (
      <PageLoader 
        message="Starting GleeWorld..." 
        className="min-h-screen"
      />
    );
  }

  // Check authentication immediately after initialization
  if (!isAuthenticated || !user) {
    console.log('🔒 RoleDashboardPage: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // For profile loading, we'll be more lenient to avoid infinite loading
  // If we have a user but no profile and it's still loading, wait briefly
  if (isLoading && !profile) {
    console.log('⏳ RoleDashboardPage: Loading user profile...');
    return (
      <PageLoader 
        message="Loading your profile..." 
        className="min-h-screen"
      />
    );
  }

  // Determine dashboard assignment with fallbacks
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
    // Default to member dashboard even if profile is still loading
    assignmentReason = `member role (role: ${profile?.role || 'loading/undefined'})`;
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
