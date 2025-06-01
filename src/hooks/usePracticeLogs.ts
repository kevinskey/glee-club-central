
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';

export interface PracticeLog {
  id: string;
  user_id: string;
  song_title?: string;
  notes?: string;
  duration?: number;
  created_at: string;
  practice_type?: string;
}

export const usePracticeLogs = () => {
  const { isAuthenticated } = useProfile();
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('practice_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching practice logs:', error);
      toast.error('Failed to fetch practice logs');
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (log: Omit<PracticeLog, 'id' | 'created_at'>) => {
    if (!isAuthenticated) return false;
    
    try {
      const { error } = await supabase
        .from('practice_logs')
        .insert(log);

      if (error) throw error;
      
      toast.success('Practice log added successfully');
      fetchLogs(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding practice log:', error);
      toast.error('Failed to add practice log');
      return false;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isAuthenticated]);

  return {
    logs,
    loading,
    fetchLogs,
    addLog
  };
};
