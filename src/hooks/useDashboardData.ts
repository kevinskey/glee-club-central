
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { usePermissions } from '@/hooks/usePermissions';

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
  
  const { user, profile, isLoading: authLoading } = useAuth();
  const { events, fetchEvents, isLoading: eventsLoading } = useCalendarStore();
  const { isLoading: permissionsLoading } = usePermissions();

  const loadDashboardData = useCallback(async () => {
    if (authLoading || permissionsLoading || !user) return;
    
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Only fetch if events are not already loaded
      if (!events || events.length === 0) {
        await fetchEvents();
      }
      
      setData({
        events: events || [],
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
  }, [authLoading, permissionsLoading, user, fetchEvents, events]);

  // Update events when they change in the store
  useEffect(() => {
    if (events && !eventsLoading) {
      setData(prev => ({ 
        ...prev, 
        events: events || [],
        isLoading: false 
      }));
    }
  }, [events, eventsLoading]);

  useEffect(() => {
    if (!authLoading && !permissionsLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, permissionsLoading, user, loadDashboardData]);

  const isReady = !authLoading && !permissionsLoading && !data.isLoading && !!user;

  return {
    ...data,
    isReady,
    reload: loadDashboardData
  };
};
