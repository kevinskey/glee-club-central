
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';

interface BaseLayoutProps {
  children?: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const { trackPageView } = useAnalyticsTracking();

  // Track page views automatically when route changes
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background">
      {children || <Outlet />}
    </div>
  );
}
