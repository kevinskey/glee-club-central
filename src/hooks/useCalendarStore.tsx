
import { create } from 'zustand';
import { CalendarEvent } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarStore {
  events: CalendarEvent[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  
  fetchEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')  // Changed from 'events' to 'calendar_events'
        .select('*')
        .order('start', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load calendar events');
        return;
      }
      
      // Transform the data to match our CalendarEvent type
      const events: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type,
        start: event.start,
        end: event.end,
        location: event.location,
        description: event.description,
        created_by: event.created_by
      }));
      
      set({ events });
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
    }
  },
  
  addEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')  // Changed from 'events' to 'calendar_events'
        .insert([event])
        .select('*')
        .single();
      
      if (error) {
        console.error('Error adding event:', error);
        toast.error('Failed to create event');
        return false;
      }
      
      // Add the new event to the store
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type,
        start: data.start,
        end: data.end,
        location: data.location,
        description: data.description,
        created_by: data.created_by
      };
      
      set(state => ({
        events: [...state.events, newEvent]
      }));
      
      return true;
    } catch (error) {
      console.error('Error in addEvent:', error);
      toast.error('Failed to create event');
      return false;
    }
  },
  
  updateEvent: async (event) => {
    try {
      const { error } = await supabase
        .from('calendar_events')  // Changed from 'events' to 'calendar_events'
        .update({
          title: event.title,
          type: event.type,
          start: event.start,
          end: event.end,
          location: event.location,
          description: event.description
        })
        .eq('id', event.id);
      
      if (error) {
        console.error('Error updating event:', error);
        toast.error('Failed to update event');
        return false;
      }
      
      // Update the event in the store
      set(state => ({
        events: state.events.map(e => 
          e.id === event.id ? event : e
        )
      }));
      
      return true;
    } catch (error) {
      console.error('Error in updateEvent:', error);
      toast.error('Failed to update event');
      return false;
    }
  },
  
  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('calendar_events')  // Changed from 'events' to 'calendar_events'
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return false;
      }
      
      // Remove the event from the store
      set(state => ({
        events: state.events.filter(e => e.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      toast.error('Failed to delete event');
      return false;
    }
  }
}));
