
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

/**
 * Custom hook for managing calendar events
 * @returns Calendar events and operations
 */
export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch all calendar events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform database records to CalendarEvent format
      const formattedEvents: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.date,
        end: event.date,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type,
        image_url: event.image_url,
        created_by: event.user_id
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a new event
  const addEvent = async (eventData: any): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add events');
      return false;
    }
    
    try {
      // Format the event data for database insertion
      const date = eventData.date instanceof Date 
        ? eventData.date.toISOString().split('T')[0] 
        : new Date(eventData.date).toISOString().split('T')[0];
        
      const event = {
        user_id: user.id,
        title: eventData.title,
        date: date,
        time: eventData.time || '00:00:00',
        location: eventData.location || '',
        description: eventData.description || '',
        type: eventData.type || 'special',
        image_url: eventData.image_url || null
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(event)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the new event to the state
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: data.date,
        end: data.date,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type,
        image_url: data.image_url,
        created_by: data.user_id
      };
      
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event added successfully');
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
      return false;
    }
  };
  
  // Update an existing event
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      const date = eventData.date instanceof Date 
        ? eventData.date.toISOString().split('T')[0] 
        : typeof eventData.date === 'string' 
          ? eventData.date 
          : new Date(eventData.date).toISOString().split('T')[0];
          
      const event = {
        title: eventData.title,
        date: date,
        time: eventData.time || '00:00:00',
        location: eventData.location || '',
        description: eventData.description || '',
        type: eventData.type || 'special',
        image_url: eventData.image_url
      };
      
      const { error } = await supabase
        .from('calendar_events')
        .update(event)
        .eq('id', eventData.id);
        
      if (error) {
        throw error;
      }
      
      // Update the event in the state
      setEvents(prev => 
        prev.map(e => e.id === eventData.id ? { ...e, ...eventData } : e)
      );
      
      toast.success('Event updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  };
  
  // Delete an event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);
        
      if (error) {
        throw error;
      }
      
      // Remove the event from the state
      setEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };
  
  // Reset all calendar events (admin function)
  const resetCalendar = async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all events
        
      if (error) {
        throw error;
      }
      
      // Clear events from state
      setEvents([]);
      toast.success('Calendar has been reset');
      return true;
    } catch (error) {
      console.error('Error resetting calendar:', error);
      toast.error('Failed to reset calendar');
      return false;
    }
  };
  
  // Load events when the component mounts
  useState(() => {
    fetchEvents();
  });
  
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
