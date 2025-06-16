
import React from 'react';
import { useFeaturePermissions } from '@/hooks/useFeaturePermissions';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureGuardProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function FeatureGuard({ 
  children, 
  feature, 
  fallback = null,
  requireAuth = true 
}: FeatureGuardProps) {
  const { isAuthenticated } = useAuth();
  const { hasFeaturePermission, loading } = useFeaturePermissions();

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Show loading state
  if (loading) {
    return <>{fallback}</>;
  }

  // Check feature permission
  if (!hasFeaturePermission(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
