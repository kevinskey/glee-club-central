
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export const useDashboardData = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isAuthenticated } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate fetching dashboard data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData({
          welcomeMessage: `Welcome, ${profile?.first_name || user?.email || 'User'}!`,
          // Add more data as needed
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user && profile && isAuthenticated) {
      fetchData();
    } else {
      setDashboardData(null);
    }
  }, [user, profile, isAuthenticated]);

  return {
    loading: authLoading || loading,
    error,
    dashboardData,
    profile,
    isAuthenticated,
    user
  };
};
