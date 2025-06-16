
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFeaturePermissions } from '@/hooks/useFeaturePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPage?: string;
  requiredFeature?: string;
  fallbackPath?: string;
  showError?: boolean;
}

export function PermissionRoute({ 
  children, 
  requiredPage, 
  requiredFeature,
  fallbackPath = '/dashboard',
  showError = true
}: PermissionRouteProps) {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const { hasPagePermission, hasFeaturePermission, loading } = useFeaturePermissions();

  // Show loader during initialization
  if (!isInitialized || isLoading || loading) {
    return (
      <PageLoader 
        message="Checking permissions..." 
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check page permission
  if (requiredPage && !hasPagePermission(requiredPage)) {
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access this page. Contact an administrator if you need access.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Check feature permission
  if (requiredFeature && !hasFeaturePermission(requiredFeature)) {
    if (showError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access this feature. Contact an administrator if you need access.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
