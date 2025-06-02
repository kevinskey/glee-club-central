
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PracticeLog,
  fetchUserPracticeLogs,
  logPracticeSession,
  deletePracticeLog as deletePracticeLogUtil,
  getPracticeStatsByCategory
} from '@/utils/supabase/practiceLogs';

export const usePracticeLogs = () => {
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await fetchUserPracticeLogs();
      setLogs(data);
      
      // Calculate total minutes
      const total = data.reduce((sum, log) => sum + log.minutes_practiced, 0);
      setTotalMinutes(total);
      
      // Get stats by category
      const categoryStats = await getPracticeStatsByCategory();
      setStats(categoryStats);
    } catch (error) {
      console.error('Error fetching practice logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const logPractice = async (
    minutes: number, 
    category: string, 
    description: string | null = null, 
    date?: string
  ): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const result = await logPracticeSession(minutes, category, description, date);
      if (result) {
        await fetchLogs(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging practice:', error);
      return false;
    }
  };

  const deletePracticeLog = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const success = await deletePracticeLogUtil(id);
      if (success) {
        await fetchLogs(); // Refresh the list
      }
      return success;
    } catch (error) {
      console.error('Error deleting practice log:', error);
      return false;
    }
  };

  const addLog = async (log: Omit<PracticeLog, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<boolean> => {
    return await logPractice(
      log.minutes_practiced,
      log.category,
      log.description,
      log.date
    );
  };

  useEffect(() => {
    fetchLogs();
  }, [isAuthenticated]);

  return {
    logs,
    stats,
    totalMinutes,
    loading,
    fetchLogs,
    addLog,
    logPractice,
    deletePracticeLog
  };
};
