
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, User } from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const auth = useAuthMigration(); // Use migration hook for backward compatibility
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    console.log('🎯 RoleDashboard: AUTH STATE CHECK:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      hasUser: !!auth.user,
      userId: auth.user?.id,
      userEmail: auth.user?.email,
      hasProfile: !!auth.profile,
      profileRole: auth.profile?.role,
      profileIsAdmin: auth.profile?.is_super_admin,
      isInitialized: auth.isInitialized,
      hasRedirected
    });

    // Wait for initialization and prevent multiple redirects
    if (!auth.isInitialized || hasRedirected) {
      return;
    }

    // Handle unauthenticated users immediately
    if (!auth.isAuthenticated || !auth.user) {
      console.log('🚫 RoleDashboard: User not authenticated, redirecting to login');
      setHasRedirected(true);
      navigate('/login', { replace: true });
      return;
    }

    // Route quickly if we have a profile - don't wait too long
    if (auth.isAuthenticated && auth.user && (auth.profile || waitTime >= 5)) {
      let targetRoute = '/dashboard/member';
      
      // Use the isAdmin function for role detection - FIX: Add parentheses
      if (auth.profile && auth.isAdmin && auth.isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin role detected, routing to admin dashboard');
      } else if (auth.profile?.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('👤 RoleDashboard: Fan role detected, routing to fan dashboard');
      } else {
        console.log('👤 RoleDashboard: Member role detected, routing to member dashboard');
      }
      
      console.log('🎯 RoleDashboard: Routing to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
      return;
    }

    // Show error if profile is missing after reasonable wait
    if (!auth.profile && auth.isAuthenticated && auth.user && !auth.isLoading && waitTime >= 5) {
      console.error(`❌ RoleDashboard: Profile missing for authenticated user ${auth.user.id}`);
      setShowError(true);
      return;
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.profile, auth.isAdmin, navigate, auth.isInitialized, hasRedirected, showError, waitTime]);

  // Quick timer for timeout handling
  useEffect(() => {
    if (auth.isAuthenticated && auth.user && !auth.profile && !hasRedirected && !showError) {
      const timer = setTimeout(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [auth.isAuthenticated, auth.user, auth.profile, hasRedirected, showError, waitTime]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setShowError(false);
    setWaitTime(0);
    
    try {
      console.log('🔄 RoleDashboard: Retrying profile resolution...');
      
      // First try to refresh user data
      if (auth.refreshUserData) {
        await auth.refreshUserData();
      }
      
      // If still no profile, try to create fallback
      setTimeout(async () => {
        if (!auth.profile && auth.createFallbackProfile) {
          console.log('🔧 RoleDashboard: Creating fallback profile...');
          await auth.createFallbackProfile();
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ RoleDashboard: Retry failed:', error);
      setShowError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleContinueAnyway = () => {
    console.log('🎯 RoleDashboard: User chose to continue without profile');
    setHasRedirected(true);
    
    // Route based on email for admin detection
    const targetRoute = auth.user?.email === 'kevinskey@mac.com' ? '/admin' : '/dashboard/member';
    navigate(targetRoute, { replace: true });
  };

  // Show initialization loading
  if (!auth.isInitialized) {
    return (
      <PageLoader 
        message="Starting GleeWorld..."
        className="min-h-screen"
      />
    );
  }

  // Show authentication redirect
  if (!auth.isAuthenticated || !auth.user) {
    return (
      <PageLoader 
        message="Redirecting to login..."
        className="min-h-screen"
      />
    );
  }

  // Show profile loading briefly
  if (auth.isLoading && waitTime < 3) {
    return (
      <PageLoader 
        message={`Loading your profile... (${waitTime}s)`}
        className="min-h-screen"
      />
    );
  }

  // Show error state with retry options
  if (showError || (!auth.profile && !auth.isLoading && waitTime >= 5)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Profile Setup Issue</CardTitle>
            <CardDescription>
              We're having trouble setting up your profile. This usually resolves quickly with a retry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Account Details</span>
              </div>
              <p><strong>User ID:</strong> {auth.user?.id}</p>
              <p><strong>Email:</strong> {auth.user?.email}</p>
              <p><strong>Status:</strong> Profile {auth.profile ? 'Loading' : 'Missing'}</p>
              {auth.user?.email === 'kevinskey@mac.com' && (
                <p><strong>Expected Role:</strong> Admin</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Setting up profile...' : 'Retry Profile Setup'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleContinueAnyway}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show final loading before dashboard redirect
  return (
    <PageLoader 
      message="Loading your dashboard..." 
      className="min-h-screen"
    />
  );
};

export default RoleDashboard;
