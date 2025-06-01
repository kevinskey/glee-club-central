
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin, isInitialized, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

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

    // If profile is missing after loading is complete, show error
    if (!isLoading && !profile && isAuthenticated && user) {
      console.error(`❌ RoleDashboard: Profile fetch failed for user ${user.id}`);
      setShowError(true);
      return;
    }

    // If we have both user and profile, redirect to appropriate dashboard
    if (isAuthenticated && user && profile && !hasRedirected) {
      let targetRoute = '/dashboard/member';
      
      if (isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin user detected, redirecting to admin dashboard');
      } else if (profile.role === 'fan') {
        targetRoute = '/fan-dashboard';
        console.log('👤 RoleDashboard: Fan user detected, redirecting to fan dashboard');
      } else {
        console.log('👤 RoleDashboard: Member user detected, redirecting to member dashboard');
      }
      
      console.log('🎯 RoleDashboard: Redirecting to:', targetRoute);
      setHasRedirected(true);
      navigate(targetRoute, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setShowError(false);
    
    try {
      if (refreshUserData) {
        await refreshUserData();
      }
    } catch (error) {
      console.error('Error retrying profile fetch:', error);
      setShowError(true);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSupportRedirect = () => {
    // Redirect to a support page or contact form
    navigate('/support', { replace: true });
  };

  // Show appropriate loading states
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Initializing authentication..."
        className="min-h-screen"
      />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <PageLoader 
        message="Redirecting to login..."
        className="min-h-screen"
      />
    );
  }

  // Show error state if profile is missing
  if (showError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              We couldn't load your profile information. This may be because your account is still being set up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
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

  return (
    <PageLoader 
      message="Loading your dashboard..." 
      className="min-h-screen"
    />
  );
};

export default RoleDashboard;
