
import { create } from 'zustand';
import { CalendarEvent } from '@/types/calendar';

// Interface for calendar store state
export interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  fetchEvents: () => Promise<CalendarEvent[]>;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  addEvents: (events: CalendarEvent[]) => void;
  resetCalendar: () => Promise<boolean>;
}

// Create the calendar store
export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  isLoading: false,
  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      // For now, we'll use mock data
      // In a real app, this would fetch from an API or database
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Rehearsal',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
          type: 'rehearsal',
          location: 'Music Room 101',
          description: 'Weekly rehearsal session'
        },
        {
          id: '2',
          title: 'Spring Concert',
          start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
          type: 'concert',
          location: 'Auditorium',
          description: 'Annual spring concert performance'
        }
      ];
      set({ events: mockEvents, isLoading: false });
      return mockEvents;
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ isLoading: false });
      return [];
    }
  },
  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
  },
  addEvents: (newEvents) => {
    set((state) => ({ events: [...state.events, ...newEvents] }));
  },
  updateEvent: async (updatedEvent) => {
    try {
      set((state) => ({
        events: state.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      }));
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  },
  deleteEvent: async (id) => {
    try {
      set((state) => ({
        events: state.events.filter((event) => event.id !== id)
      }));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },
  resetCalendar: async () => {
    try {
      // In a real implementation, this would make an API call to delete all events
      // For now, we'll just clear the events array
      set({ events: [] });
      return true;
    } catch (error) {
      console.error('Error resetting calendar:', error);
      return false;
    }
  }
}));
