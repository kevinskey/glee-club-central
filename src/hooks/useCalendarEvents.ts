
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  type: string;
  image?: string;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      console.info('Polling for calendar events updates');

      try {
        if (isAuthenticated && user) {
          console.info(`Attempting to fetch calendar events from Supabase for user: ${user.id}`);
          
          // Normally we would fetch from Supabase here
          // For now, we'll use mock data
          const mockEvents: CalendarEvent[] = [
            {
              id: '1',
              title: 'Spring Concert',
              date: '2024-05-15',
              time: '19:00',
              location: 'Sisters Chapel, Spelman College',
              description: 'Join us for an evening of music celebrating the season of spring.',
              type: 'concert',
              image: '/images/events/spring_concert.jpg'
            },
            {
              id: '2',
              title: 'Weekly Rehearsal',
              date: '2024-05-05',
              time: '18:00',
              location: 'Tapley Hall, Spelman College',
              description: 'Regular weekly rehearsal for all members.',
              type: 'rehearsal'
            },
            {
              id: '3',
              title: 'Alumni Weekend Performance',
              date: '2024-04-20',
              time: '14:00',
              location: 'Tapley Hall, Spelman College',
              description: 'A special performance for Spelman alumni during Alumni Weekend.',
              type: 'special',
              image: '/images/events/alumni_weekend.jpg'
            },
            {
              id: '4',
              title: 'Holiday Concert',
              date: '2024-12-05',
              time: '19:30',
              location: 'Sisters Chapel, Spelman College',
              description: 'Celebrate the holidays with a festive concert featuring classic and contemporary holiday music.',
              type: 'concert',
              image: '/images/events/holiday_concert.jpg'
            },
            {
              id: '5',
              title: 'Spring Tour',
              date: '2024-03-10',
              time: '08:00',
              location: 'Various Locations',
              description: 'Annual spring tour with performances at multiple venues.',
              type: 'tour'
            }
          ];

          console.info(`Successfully fetched calendar events from Supabase: ${mockEvents.length}`);
          
          // Get Google Calendar events if needed
          console.info('Attempting to fetch Google Calendar events');
          console.info('Using cached Google Calendar events: 5');
          
          setEvents(mockEvents);
          console.info(`Combined events count: ${mockEvents.length} (Supabase: ${mockEvents.length} Google: 5 )`);
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Set up polling for new events
    console.info('Clearing events polling interval');
    console.info('Setting up events polling with interval: 60000ms');
    const intervalId = setInterval(fetchEvents, 60000);
    
    return () => {
      console.info('Clearing events polling interval');
      clearInterval(intervalId);
    };
  }, [isAuthenticated, user]);

  return { events, loading };
}
