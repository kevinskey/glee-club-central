import { create } from 'zustand';
import { CalendarEvent, EventType } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLoadingCoordinator } from './useLoadingCoordinator';

interface CalendarStore {
  events: CalendarEvent[];
  isLoading: boolean;
  lastFetch: number | null;
  fetchInProgress: boolean;
  fetchEvents: () => Promise<CalendarEvent[]>;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

// Debounce time in milliseconds
const FETCH_DEBOUNCE_TIME = 500;
const CACHE_DURATION = 30000; // 30 seconds

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  isLoading: false,
  lastFetch: null,
  fetchInProgress: false,
  
  fetchEvents: async (): Promise<CalendarEvent[]> => {
    const state = get();
    const now = Date.now();
    
    // Return cached events if recently fetched
    if (state.lastFetch && (now - state.lastFetch) < CACHE_DURATION && state.events.length > 0) {
      console.log('Using cached calendar events');
      return state.events;
    }
    
    // Prevent multiple simultaneous fetches
    if (state.fetchInProgress) {
      console.log('Fetch already in progress, returning current events');
      return state.events;
    }
    
    try {
      set({ isLoading: true, fetchInProgress: true });
      
      // Set loading state in coordinator
      useLoadingCoordinator.getState().setLoading('calendar', true);
      
      console.log('Fetching calendar events from database');
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load calendar events');
        set({ isLoading: false, fetchInProgress: false });
        useLoadingCoordinator.getState().setLoading('calendar', false);
        return state.events;
      }
      
      // Transform the data from DB schema to our CalendarEvent type
      const events: CalendarEvent[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        type: event.type as EventType,
        start: new Date(`${event.date}T${event.time || '00:00:00'}`).toISOString(),
        end: new Date(`${event.date}T${event.time || '00:00:00'}`).toISOString(),
        location: event.location || '',
        description: event.description || '',
        image_url: event.image_url || null,
        created_by: event.user_id,
        allDay: event.allday || false
      }));
      
      set({ 
        events, 
        isLoading: false, 
        fetchInProgress: false,
        lastFetch: now 
      });
      
      // Mark calendar loading as complete
      useLoadingCoordinator.getState().setLoading('calendar', false);
      
      console.log(`Loaded ${events.length} calendar events`);
      return events;
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
      set({ isLoading: false, fetchInProgress: false });
      useLoadingCoordinator.getState().setLoading('calendar', false);
      return state.events;
    }
  },
  
  addEvent: async (event) => {
    try {
      // Transform our CalendarEvent type to match DB schema
      const dbEvent = {
        title: event.title,
        type: event.type || 'concert',
        date: new Date(event.start).toISOString().split('T')[0], // Extract YYYY-MM-DD
        time: new Date(event.start).toISOString().split('T')[1].substring(0, 8), // Extract HH:MM:SS
        location: event.location || '',
        description: event.description || '',
        image_url: event.image_url,
        user_id: event.created_by,
        allday: event.allDay || false
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([dbEvent])
        .select('*')
        .single();
      
      if (error) {
        console.error('Error adding event:', error);
        toast.error('Failed to create event');
        return false;
      }
      
      // Add the new event to the store, transforming back to our CalendarEvent type
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type as EventType,
        start: new Date(`${data.date}T${data.time || '00:00:00'}`).toISOString(),
        end: new Date(`${data.date}T${data.time || '00:00:00'}`).toISOString(),
        location: data.location || '',
        description: data.description || '',
        image_url: data.image_url || null,
        created_by: data.user_id,
        allDay: data.allday || false
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
      // Transform our CalendarEvent type to match DB schema
      const dbEvent = {
        title: event.title,
        type: event.type,
        date: new Date(event.start).toISOString().split('T')[0],
        time: new Date(event.start).toISOString().split('T')[1].substring(0, 8),
        location: event.location || '',
        description: event.description || '',
        image_url: event.image_url || null,
        allday: event.allDay || false
      };
      
      const { error } = await supabase
        .from('calendar_events')
        .update(dbEvent)
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
        .from('calendar_events')
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
