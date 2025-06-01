
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, User } from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.log('🎯 RoleDashboard: AUTH STATE CHECK:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileId: profile?.id,
      profileRole: profile?.role,
      profileIsAdmin: profile?.is_super_admin,
      isAdminFunction: isAdmin ? isAdmin() : false,
      isInitialized,
      hasRedirected,
      showError
    });

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

    // Continue loading if we're still fetching profile data
    if (isLoading) {
      console.log('⏳ RoleDashboard: Still loading profile data, waiting...');
      return;
    }

    // Show error if profile is missing after loading completes
    if (!profile && isAuthenticated && user && !isLoading) {
      console.error(`❌ RoleDashboard: Profile missing for authenticated user ${user.id}`);
      setShowError(true);
      return;
    }

    // Route to appropriate dashboard when we have complete data
    if (isAuthenticated && user && profile && !hasRedirected && !isLoading) {
      let targetRoute = '/dashboard/member';
      
      // Use the isAdmin function for role detection
      if (isAdmin && isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin role detected, routing to admin dashboard');
      } else if (profile.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('👤 RoleDashboard: Fan role detected, routing to fan dashboard');
      } else {
        console.log('👤 RoleDashboard: Member role detected, routing to member dashboard');
      }
      
      console.log('🎯 RoleDashboard: Routing to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected, showError]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setShowError(false);
    setHasRedirected(false);
    
    try {
      console.log('🔄 RoleDashboard: Retrying profile resolution...');
      if (refreshUserData) {
        await refreshUserData();
      }
    } catch (error) {
      console.error('❌ RoleDashboard: Retry failed:', error);
      setShowError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSupportRedirect = () => {
    navigate('/support', { replace: true });
  };

  // Show initialization loading
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Initializing authentication system..."
        className="min-h-screen"
      />
    );
  }

  // Show authentication redirect
  if (!isAuthenticated || !user) {
    return (
      <PageLoader 
        message="Redirecting to login..."
        className="min-h-screen"
      />
    );
  }

  // Show profile resolution loading
  if (isLoading && !showError) {
    return (
      <PageLoader 
        message="Setting up your profile..."
        className="min-h-screen"
      />
    );
  }

  // Show error state with retry options
  if (showError || (!profile && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Status:</strong> Profile Creation Issue</p>
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
                onClick={handleSupportRedirect}
                className="w-full"
              >
                Contact Support
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
