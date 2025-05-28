
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching events...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      console.log('Events fetched successfully:', data);
      setEvents(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error in fetchEvents:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      console.log('Creating event:', eventData);
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, created_by: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }
      
      console.log('Event created successfully:', data);
      await fetchEvents();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      console.error('Error in createEvent:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      console.log('Updating event:', id, eventData);
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }
      
      console.log('Event updated successfully:', data);
      await fetchEvents();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      console.error('Error in updateEvent:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      console.log('Deleting event:', id);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
      
      console.log('Event deleted successfully');
      await fetchEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      console.error('Error in deleteEvent:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
