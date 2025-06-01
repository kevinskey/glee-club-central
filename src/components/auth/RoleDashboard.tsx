
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
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    console.log('🎯 RoleDashboard: AUTH STATE CHECK:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      hasProfile: !!profile,
      profileRole: profile?.role,
      isInitialized,
      hasRedirected
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

    // Route quickly - don't wait too long for profile
    if (isAuthenticated && user && (profile || waitTime >= 3)) {
      let targetRoute = '/dashboard/member';
      
      // Use the isAdmin function for role detection
      if (profile && isAdmin && isAdmin()) {
        targetRoute = '/admin';
        console.log('👑 RoleDashboard: Admin role detected, routing to admin dashboard');
      } else if (profile?.role === 'fan') {
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
    if (!profile && isAuthenticated && user && !isLoading && waitTime >= 3) {
      console.error(`❌ RoleDashboard: Profile missing for authenticated user ${user.id}`);
      setShowError(true);
      return;
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate, isInitialized, hasRedirected, showError, waitTime]);

  // Quick timer for timeout handling
  useEffect(() => {
    if (isAuthenticated && user && !profile && !hasRedirected && !showError) {
      const timer = setTimeout(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, profile, hasRedirected, showError, waitTime]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setShowError(false);
    setWaitTime(0);
    
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

  // Show initialization loading
  if (!isInitialized) {
    return (
      <PageLoader 
        message="Starting GleeWorld..."
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

  // Show profile loading briefly
  if (isLoading && waitTime < 3) {
    return (
      <PageLoader 
        message={`Loading your dashboard... (${waitTime}s)`}
        className="min-h-screen"
      />
    );
  }

  // Show error state with retry options
  if (showError || (!profile && !isLoading && waitTime >= 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Profile Setup Issue</CardTitle>
            <CardDescription>
              We're having trouble loading your profile. You can try again or continue to the dashboard.
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
              <p><strong>Status:</strong> Profile Loading Issue</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry Profile Setup'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/member', { replace: true })}
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
