import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarEvent, EventType } from '@/types/calendar';

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedEvents = data.map((event: any) => {
        const startDate = new Date(event.date + 'T' + (event.time || '00:00:00'));
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          location: event.location || '',
          start: startDate,
          end: endDate,
          date: startDate,
          time: event.time || '',
          type: event.type || 'other',
          image_url: event.image_url,
          created_by: event.user_id,
          allDay: event.allday || false,
          source: event.source || 'local'
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add events');
        return false;
      }

      // Format date for database
      const formattedDate = event.date instanceof Date ? 
        event.date.toISOString().split('T')[0] : 
        typeof event.date === 'string' ? event.date : new Date().toISOString().split('T')[0];
      
      const formattedTime = event.time || '00:00';

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          title: event.title,
          description: event.description,
          date: formattedDate,
          time: formattedTime,
          location: event.location,
          type: event.type,
          image_url: event.image_url,
          user_id: user.id,
          allday: event.allDay || false
        }])
        .select();

      if (error) throw error;

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
      return false;
    }
  };

  // Update existing event
  const updateEvent = async (event: CalendarEvent) => {
    try {
      if (!user) {
        toast.error('You must be logged in to update events');
        return false;
      }

      // Format date for database
      const formattedDate = event.date instanceof Date ? 
        event.date.toISOString().split('T')[0] : 
        typeof event.date === 'string' ? event.date : new Date().toISOString().split('T')[0];
        
      const formattedTime = event.time || '00:00';

      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: event.title,
          description: event.description,
          date: formattedDate,
          time: formattedTime,
          location: event.location,
          type: event.type,
          image_url: event.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      if (error) throw error;

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to delete events');
        return false;
      }

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };

  // Reset calendar (delete all events)
  const resetCalendar = async () => {
    try {
      if (!user) {
        toast.error('You must be logged in to reset the calendar');
        return false;
      }

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .neq('id', '0'); // Delete all events

      if (error) throw error;

      await fetchEvents();
      toast.success('Calendar has been reset');
      return true;
    } catch (error) {
      console.error('Error resetting calendar:', error);
      toast.error('Failed to reset calendar');
      return false;
    }
  };

  // Load events on mount
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    resetCalendar
  };
}
