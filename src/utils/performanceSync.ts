
import { supabase } from '@/integrations/supabase/client';
import { EventType, CalendarEvent } from '@/types/calendar';

export interface PerformanceEvent {
  id: string;
  title: string;
  date: Date | string;
  location?: string;
  description?: string;
  imageUrl?: string;
  eventUrl?: string;
}

// Helper function to convert date strings to Date objects
const ensureDate = (dateStr: string | Date): Date => {
  return typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
};

// Placeholder for external API that fetches performance events
const fetchEventsFromAPI = async (): Promise<PerformanceEvent[]> => {
  // This would normally call an API
  // For demo purposes, we'll return mock data
  return [
    {
      id: 'perf-1',
      title: 'Annual Spring Concert',
      date: new Date(new Date().getFullYear(), 3, 15, 19, 0), // April 15 this year, 7pm
      location: 'Sisters Chapel, Spelman College',
      description: 'Join us for our annual spring concert featuring classic and contemporary choral works.',
      imageUrl: '/lovable-uploads/b57ced8e-7ed7-405b-8302-41ab726303af.png'
    },
    {
      id: 'perf-2',
      title: 'Christmas Carol Service',
      date: new Date(new Date().getFullYear(), 11, 10, 19, 30), // Dec 10 this year, 7:30pm
      location: 'Martin Luther King Jr. International Chapel',
      description: 'A beloved holiday tradition featuring seasonal classics and spirituals.',
      imageUrl: '/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png'
    },
    {
      id: 'perf-3',
      title: 'Alumnae Reunion Performance',
      date: new Date(new Date().getFullYear(), 4, 20, 14, 0), // May 20 this year, 2pm
      location: 'Reynolds Cottage',
      description: 'Special performance for Spelman alumnae during reunion weekend.',
      imageUrl: '/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png'
    }
  ];
};

// Function to convert performance events to calendar events format
const transformToCalendarEvents = (performances: PerformanceEvent[]): CalendarEvent[] => {
  return performances.map(perf => {
    const startDate = ensureDate(perf.date);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // Default to 2 hour duration

    return {
      id: perf.id,
      title: perf.title,
      start: startDate,
      end: endDate,
      description: perf.description || '',
      location: perf.location || '',
      type: "event" as EventType,
      image_url: perf.imageUrl || '',
      allDay: false
    };
  });
};

// Public function to get performance events in calendar format
export const getPerformanceEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const performances = await fetchEventsFromAPI();
    return transformToCalendarEvents(performances);
  } catch (error) {
    console.error("Error fetching performance events:", error);
    return [];
  }
};
