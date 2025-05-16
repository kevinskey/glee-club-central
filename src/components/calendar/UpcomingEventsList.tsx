
import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Helper function to format dates
const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

export interface UpcomingEventsListProps {
  type?: string;
  limit?: number;
}

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ 
  type = 'all',
  limit = 3 
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { events: storeEvents, fetchEvents } = useCalendarStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        await fetchEvents();
        
        // Filter by event type if specified
        let filteredEvents = storeEvents;
        if (type !== 'all') {
          filteredEvents = storeEvents.filter(event => event.type === type);
        }
        
        // Sort by date (closest first)
        const sortedEvents = [...filteredEvents].sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
        
        // Only get upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => 
          new Date(event.start) >= today
        );
        
        // Limit to specified number
        const limitedEvents = upcomingEvents.slice(0, limit);
        
        setEvents(limitedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents, limit, type, storeEvents]);
  
  const viewEvent = (event: CalendarEvent) => {
    navigate(`/dashboard/calendar?event=${event.id}`);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800">
            <CardContent className="p-4 h-20"></CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No upcoming events scheduled</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => viewEvent(event)}>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-base">{event.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(event.start)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {events.length > 0 && (
        <div className="flex justify-center mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/calendar')}
          >
            View All Events
          </Button>
        </div>
      )}
    </div>
  );
};
