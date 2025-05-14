
import { create } from 'zustand';
import { CalendarEvent, EventType } from '@/types/calendar'; 
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarState {
  events: CalendarEvent[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: any) => Promise<boolean>;
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  setEvents: (events: CalendarEvent[]) => void;
  lastSynced: Date | null;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  lastSynced: null,
  
  fetchEvents: async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to fetch events');
        return;
      }
      
      // Format the events to ensure they have the right structure
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type as EventType,
        date: event.date,
        time: event.time,
        description: event.description || '',
        location: event.location || '',
        start: new Date(event.date + 'T' + (event.time || '00:00:00')),
        end: new Date(event.date + 'T' + (event.time || '00:00:00')),
        image_url: event.image_url,
        allDay: event.allday || false,
        created_by: event.user_id,
        source: 'local' as 'local' | 'google'
      }));
      
      set({ events: formattedEvents, lastSynced: new Date() });
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
    }
  },
  
  addEvent: async (event) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('User not logged in');
      
      // Format the data for database insert
      const eventData = {
        title: event.title,
        description: event.description || '',
        date: typeof event.date === 'string' ? event.date : event.date.toISOString().split('T')[0],
        time: event.time || '00:00:00',
        location: event.location || '',
        type: event.type || 'special',
        user_id: userData.user.id,
        image_url: event.image_url || null,
        allday: event.allDay || false
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(eventData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new event to the state
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type as EventType,
        start: new Date(data.date + 'T' + (data.time || '00:00:00')),
        end: new Date(data.date + 'T' + (data.time || '00:00:00')),
        image_url: data.image_url,
        allDay: data.allday || false,
        created_by: data.user_id,
        source: 'local'
      };
      
      set(state => ({ 
        events: [...state.events, newEvent],
        lastSynced: new Date()
      }));
      
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
      return false;
    }
  },
  
  updateEvent: async (event) => {
    try {
      // Format the event for database update
      const eventData = {
        title: event.title,
        description: event.description || '',
        date: typeof event.date === 'string' ? event.date : 
              event.date instanceof Date ? event.date.toISOString().split('T')[0] :
              typeof event.start === 'string' ? new Date(event.start).toISOString().split('T')[0] :
              event.start.toISOString().split('T')[0],
        time: event.time || '00:00:00',
        location: event.location || '',
        type: event.type,
        image_url: event.image_url,
        allday: event.allDay || false
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', event.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the event in state
      set(state => ({
        events: state.events.map(e => e.id === event.id ? {
          ...e,
          ...eventData,
          start: new Date(eventData.date + 'T' + (eventData.time || '00:00:00')),
          end: new Date(eventData.date + 'T' + (eventData.time || '00:00:00')),
        } : e),
        lastSynced: new Date()
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  },
  
  deleteEvent: async (id) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the event from state
      set(state => ({
        events: state.events.filter(e => e.id !== id),
        lastSynced: new Date()
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  },
  
  setEvents: (events) => {
    set({ events, lastSynced: new Date() });
  }
}));
