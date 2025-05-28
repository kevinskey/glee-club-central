
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
      
      // Simple query without complex joins or recursive lookups
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Events fetched successfully:', data?.length || 0, 'events');
      setEvents(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error in fetchEvents:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      console.log('Creating event:', eventData);
      
      if (!user?.id) {
        throw new Error('User must be authenticated to create events');
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, created_by: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw new Error(`Failed to create event: ${error.message}`);
      }
      
      console.log('Event created successfully:', data);
      await fetchEvents(); // Refresh the events list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      console.error('Error in createEvent:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>) => {
    try {
      console.log('Updating event:', id, eventData);
      
      if (!user?.id) {
        throw new Error('User must be authenticated to update events');
      }

      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw new Error(`Failed to update event: ${error.message}`);
      }
      
      console.log('Event updated successfully:', data);
      await fetchEvents(); // Refresh the events list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      console.error('Error in updateEvent:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      console.log('Deleting event:', id);
      
      if (!user?.id) {
        throw new Error('User must be authenticated to delete events');
      }

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw new Error(`Failed to delete event: ${error.message}`);
      }
      
      console.log('Event deleted successfully');
      await fetchEvents(); // Refresh the events list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      console.error('Error in deleteEvent:', err);
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
