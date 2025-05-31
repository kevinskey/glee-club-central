
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useLoadingCoordinator } from '@/hooks/useLoadingCoordinator';

export interface DashboardData {
  events: any[];
  isLoading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    events: [],
    isLoading: false, // Start with false to prevent initial blinking
    error: null
  });
  
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isLoading: permissionsLoading } = usePermissions();
  const { setLoading, isReady: coordinatorReady } = useLoadingCoordinator();
  
  // Debounced authentication readiness to prevent rapid state changes
  const [debouncedAuthReady, setDebouncedAuthReady] = useState(false);
  
  const isAuthReady = useMemo(() => 
    isAuthenticated && !authLoading && !!user && !!profile, 
    [isAuthenticated, authLoading, user, profile]
  );
  
  const isPermissionsReady = useMemo(() => 
    !permissionsLoading, 
    [permissionsLoading]
  );
  
  // Debounce auth ready state to prevent blinking
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAuthReady(isAuthReady);
    }, 100); // Small delay to debounce rapid changes
    
    return () => clearTimeout(timer);
  }, [isAuthReady]);
  
  // Update loading coordinator when auth state changes (debounced)
  useEffect(() => {
    setLoading('auth', authLoading);
  }, [authLoading, setLoading]);
  
  useEffect(() => {
    setLoading('permissions', permissionsLoading);
  }, [permissionsLoading, setLoading]);
  
  useEffect(() => {
    setLoading('profile', !profile && isAuthenticated);
  }, [profile, setLoading, isAuthenticated]);

  // Simplified data loading function
  const loadDashboardData = useCallback(async () => {
    if (!debouncedAuthReady || !isPermissionsReady) {
      return;
    }
    
    try {
      // Since calendar functionality is removed, just return empty events
      // This prevents unnecessary loading states
      setData({
        events: [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  }, [debouncedAuthReady, isPermissionsReady]);

  // Load data when auth is ready (debounced)
  useEffect(() => {
    if (debouncedAuthReady && isPermissionsReady) {
      loadDashboardData();
    }
  }, [debouncedAuthReady, isPermissionsReady, loadDashboardData]);

  // Simplified readiness state to prevent blinking
  const isReady = useMemo(() => 
    debouncedAuthReady && isPermissionsReady && !data.isLoading,
    [debouncedAuthReady, isPermissionsReady, data.isLoading]
  );

  return {
    ...data,
    isReady,
    reload: loadDashboardData
  };
};
