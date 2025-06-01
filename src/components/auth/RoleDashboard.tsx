
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [debugMode] = useState(true); // Enable debug mode temporarily

  useEffect(() => {
    console.log('🎯 RoleDashboard: DETAILED AUTH STATE CHECK:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileId: profile?.id,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin,
      profileStatus: profile?.status,
      isAdminFunction: isAdmin ? isAdmin() : false,
      isInitialized,
      hasRedirected,
      timestamp: new Date().toISOString()
    });

    // TEMPORARILY DISABLED: Skip all role-based redirects for debugging
    if (debugMode) {
      console.log('🚧 RoleDashboard: DEBUG MODE - Skipping role-based redirects');
      return;
    }

    // Wait for initialization and prevent multiple redirects
    if (!isInitialized || hasRedirected) {
      return;
    }

    // Handle unauthenticated users immediately
    if (!isAuthenticated || !user) {
      console.log('🚫 RoleDashboard: User not authenticated, redirecting to login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
      return;
    }

    // If user is authenticated but still loading profile, wait a bit
    if (isLoading && !profile) {
      console.log('⏳ RoleDashboard: Still loading profile...');
      return;
    }

    // After a reasonable timeout, proceed with default routing even if profile isn't loaded
    const timeoutId = setTimeout(() => {
      if (isAuthenticated && user && !hasRedirected) {
        console.log('⏰ RoleDashboard: Profile load timeout, using default routing');
        
        let targetRoute = '/dashboard/member'; // Default for authenticated users
        
        // Only check admin status if profile is loaded
        if (profile) {
          if (isAdmin()) {
            targetRoute = '/admin';
            console.log('👑 RoleDashboard: Admin user, redirecting to admin dashboard');
          } else if (profile.role === 'fan') {
            targetRoute = '/fan-dashboard';
            console.log('👤 RoleDashboard: Fan user, redirecting to fan dashboard');
          } else {
            console.log('👤 RoleDashboard: Member user, redirecting to member dashboard');
          }
        } else {
          console.log('👤 RoleDashboard: No profile loaded, defaulting to member dashboard');
        }
        
        console.log('🎯 RoleDashboard: Redirecting to:', targetRoute);
        setHasRedirected(true);
        navigate(targetRoute, { replace: true });
      }
    }, 3000); // 3 second timeout

    // If we have both user and profile, redirect immediately
    if (isAuthenticated && user && profile && !hasRedirected) {
      clearTimeout(timeoutId);
      
      let targetRoute = '/dashboard/member';
      
      if (isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin user detected');
      } else if (profile.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('👤 RoleDashboard: Fan user detected');
      } else {
        console.log('👤 RoleDashboard: Member user detected');
      }
      
      console.log('🎯 RoleDashboard: Immediate redirect to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected, debugMode]);

  // Show appropriate loading states
  if (!isInitialized) {
    return (
      <div>
        <PageLoader 
          message="Initializing authentication..."
          className="min-h-screen"
        />
        {debugMode && (
          <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs">
            <div>🚧 DEBUG MODE ACTIVE</div>
            <div>Auth initialized: {isInitialized ? 'Yes' : 'No'}</div>
            <div>User: {user?.email || 'None'}</div>
            <div>Profile: {profile?.role || 'None'}</div>
          </div>
        )}
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div>
        <PageLoader 
          message="Redirecting to login..."
          className="min-h-screen"
        />
        {debugMode && (
          <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs">
            <div>🚧 DEBUG MODE ACTIVE</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div>User: {user?.email || 'None'}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageLoader 
        message="Loading your dashboard..." 
        className="min-h-screen"
      />
      {debugMode && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs max-w-sm">
          <div className="font-bold mb-2">🚧 DEBUG INFO</div>
          <div>User ID: {user?.id}</div>
          <div>Email: {user?.email}</div>
          <div>Profile ID: {profile?.id || 'Missing'}</div>
          <div>Role: {profile?.role || 'Missing'}</div>
          <div>Is Admin: {profile?.is_super_admin ? 'Yes' : 'No'}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Redirects disabled for debugging</div>
        </div>
      )}
    </div>
  );
};

export default RoleDashboard;
