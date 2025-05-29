
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/calendar';

export const useConcertEvents = () => {
  const [concerts, setConcerts] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching concert events...');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_type', 'concert')
        .eq('is_private', false)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Concert events fetched successfully:', data?.length || 0, 'concerts');
      setConcerts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch concerts';
      console.error('Error in fetchConcerts:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  return {
    concerts,
    loading,
    error,
    refetch: fetchConcerts
  };
};
