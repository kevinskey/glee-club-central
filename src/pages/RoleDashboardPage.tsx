
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';
import { devLog } from '@/utils/devLogger';

const RoleDashboardPage = () => {
  const { user, profile, isLoading, isInitialized, isAuthenticated, isAdmin } = useAuth();

  devLog('🏠 RoleDashboardPage: DASHBOARD ASSIGNMENT STATE:', {
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

  // Show loading only briefly during initialization
  if (!isInitialized && isLoading) {
    devLog('⏳ RoleDashboardPage: Waiting for auth initialization...');
    return (
      <PageLoader 
        message="Starting GleeWorld..." 
        className="min-h-screen"
      />
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    devLog('🔒 RoleDashboardPage: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Determine dashboard assignment with immediate decisions
  let redirectPath = '/dashboard/member'; // Default fallback
  let assignmentReason = 'default member assignment';
  
  // Check for admin access - prioritize known admin email immediately
  const isKnownAdmin = user.email === 'kevinskey@mac.com';
  
  if (isKnownAdmin) {
    redirectPath = '/admin';
    assignmentReason = 'known admin email';
  } else if (isAdmin()) {
    redirectPath = '/admin';
    assignmentReason = 'admin profile detected';
  } else if (profile?.role === 'fan') {
    redirectPath = '/dashboard/fan';
    assignmentReason = 'fan role detected';
  } else {
    // Default to member dashboard
    assignmentReason = `member role (profile loaded: ${!!profile})`;
  }
  
  devLog('🎯 RoleDashboardPage: DASHBOARD ASSIGNMENT DECISION:', {
    finalPath: redirectPath,
    reason: assignmentReason,
    userEmail: user.email,
    profileRole: profile?.role,
    isAdminResult: isAdmin(),
    isKnownAdmin,
    timestamp: new Date().toISOString()
  });
  
  return <Navigate to={redirectPath} replace />;
};

export default RoleDashboardPage;
