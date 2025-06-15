
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsEvent {
  event_type: string;
  page_path?: string;
  user_agent?: string;
  session_duration?: number;
  feature_used?: string;
  metadata?: Record<string, any>;
}

export function useAnalyticsTracking() {
  const { user } = useAuth();

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        event_type: event.event_type,
        page_path: event.page_path || window.location.pathname,
        user_agent: event.user_agent || navigator.userAgent,
        session_duration: event.session_duration,
        feature_used: event.feature_used,
        metadata: event.metadata || {},
        ip_address: null, // Will be handled by RLS/backend
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (pagePath?: string) => {
    trackEvent({
      event_type: 'page_view',
      page_path: pagePath || window.location.pathname
    });
  };

  const trackFeatureUsage = (feature: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'feature_usage',
      feature_used: feature,
      metadata
    });
  };

  const trackUserAction = (action: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'user_action',
      feature_used: action,
      metadata
    });
  };

  // Auto-track page views
  useEffect(() => {
    trackPageView();
    
    // Track session start
    trackEvent({
      event_type: 'session_start'
    });

    // Track session end on page unload
    const handleBeforeUnload = () => {
      trackEvent({
        event_type: 'session_end',
        session_duration: Date.now() - performance.now()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackFeatureUsage,
    trackUserAction
  };
}
