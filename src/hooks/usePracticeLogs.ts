
import { useState, useEffect } from 'react';
import { 
  fetchUserPracticeLogs, 
  logPracticeSession, 
  deletePracticeLog, 
  updatePracticeLog,
  getPracticeStatsByCategory,
  type PracticeLog 
} from '@/utils/supabase/practiceLogs';
import { useAuth } from '@/contexts/AuthContext';

export const usePracticeLogs = () => {
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const { isAuthenticated } = useAuth();

  const loadPracticeLogs = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    const fetchedLogs = await fetchUserPracticeLogs();
    setLogs(fetchedLogs);
    setIsLoading(false);
    
    // Also fetch statistics
    const practiceStats = await getPracticeStatsByCategory();
    setStats(practiceStats);
  };

  // Create a new practice log
  const addPracticeLog = async (
    minutes: number,
    category: string,
    description: string | null = null,
    date?: string
  ) => {
    const newLog = await logPracticeSession(minutes, category, description, date);
    if (newLog) {
      setLogs(prev => [newLog, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        [category]: (prev[category] || 0) + minutes
      }));
      return true;
    }
    return false;
  };

  // Delete a practice log
  const removePracticeLog = async (id: string) => {
    const logToDelete = logs.find(log => log.id === id);
    const success = await deletePracticeLog(id);
    if (success && logToDelete) {
      setLogs(logs.filter(log => log.id !== id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        [logToDelete.category]: (prev[logToDelete.category] || 0) - logToDelete.minutes_practiced
      }));
      return true;
    }
    return false;
  };

  // Update a practice log
  const editPracticeLog = async (id: string, updates: Partial<Omit<PracticeLog, "id" | "user_id" | "created_at" | "updated_at">>) => {
    const oldLog = logs.find(log => log.id === id);
    const updatedLog = await updatePracticeLog(id, updates);
    if (updatedLog && oldLog) {
      setLogs(logs.map(log => log.id === id ? updatedLog : log));
      
      // Update stats if category or minutes changed
      if (updates.category || updates.minutes_practiced) {
        const newStats = { ...stats };
        
        // Remove old stats
        newStats[oldLog.category] = (newStats[oldLog.category] || 0) - oldLog.minutes_practiced;
        
        // Add new stats
        const newCategory = updates.category || oldLog.category;
        const newMinutes = updates.minutes_practiced !== undefined ? updates.minutes_practiced : oldLog.minutes_practiced;
        newStats[newCategory] = (newStats[newCategory] || 0) + newMinutes;
        
        setStats(newStats);
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPracticeLogs();
    }
  }, [isAuthenticated]);

  return { 
    logs, 
    isLoading, 
    stats,
    addPracticeLog, 
    removePracticeLog, 
    editPracticeLog, 
    refresh: loadPracticeLogs 
  };
};
