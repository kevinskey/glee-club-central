
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
    isLoading: true,
    error: null
  });
  
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isLoading: permissionsLoading } = usePermissions();
  const { setLoading, isReady: coordinatorReady } = useLoadingCoordinator();
  
  // Memoize authentication readiness to prevent unnecessary re-renders
  const isAuthReady = useMemo(() => 
    isAuthenticated && !authLoading && !!user && !!profile, 
    [isAuthenticated, authLoading, user, profile]
  );
  
  const isPermissionsReady = useMemo(() => 
    !permissionsLoading, 
    [permissionsLoading]
  );
  
  // Update loading coordinator when auth state changes
  useEffect(() => {
    setLoading('auth', authLoading);
  }, [authLoading, setLoading]);
  
  useEffect(() => {
    setLoading('permissions', permissionsLoading);
  }, [permissionsLoading, setLoading]);
  
  useEffect(() => {
    setLoading('profile', !profile);
  }, [profile, setLoading]);

  // Memoized data loading function to prevent unnecessary re-renders
  const loadDashboardData = useCallback(async () => {
    if (!isAuthReady || !isPermissionsReady) {
      console.log('Dashboard data loading skipped - dependencies not ready');
      return;
    }
    
    try {
      console.log('Loading dashboard data...');
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Since calendar functionality is removed, just return empty events
      setData({
        events: [],
        isLoading: false,
        error: null
      });
      
      console.log('Dashboard data loaded');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load dashboard data'
      }));
    }
  }, [isAuthReady, isPermissionsReady]);

  // Load data when auth is ready
  useEffect(() => {
    let mounted = true;
    
    if (isAuthReady && isPermissionsReady && data.events.length === 0 && !data.isLoading) {
      console.log('Triggering initial dashboard data load');
      loadDashboardData().then(() => {
        if (mounted) {
          console.log('Initial dashboard data load completed');
        }
      });
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthReady, isPermissionsReady, loadDashboardData, data.events.length, data.isLoading]);

  // Memoized readiness state to prevent unnecessary re-renders
  const isReady = useMemo(() => 
    isAuthReady && isPermissionsReady && !data.isLoading && coordinatorReady,
    [isAuthReady, isPermissionsReady, data.isLoading, coordinatorReady]
  );

  return {
    ...data,
    isReady,
    reload: loadDashboardData
  };
};
