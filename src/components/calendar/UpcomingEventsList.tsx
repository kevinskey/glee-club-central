
import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface UpcomingEventsListProps {
  type?: string;
  limit?: number;
  maxItems?: number;  // Added for backwards compatibility
  showType?: string;  // Added for backwards compatibility
  events?: CalendarEvent[]; // Allow directly passing events
  onEventClick?: (event: CalendarEvent) => Promise<boolean>;
  className?: string;
  maxHeight?: string;
}

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ 
  type = 'all',
  limit = 3,
  maxItems, // Legacy prop support
  showType, // Legacy prop support
  events: propEvents,
  onEventClick,
  className = '',
  maxHeight
}) => {
  // Use whichever provided - for backward compatibility
  const actualLimit = maxItems || limit;
  const actualType = showType || type;
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchEvents, events: storeEvents } = useCalendarStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (propEvents) {
      // Use provided events if available
      setEvents(propEvents);
      setLoading(false);
      return;
    }
    
    // Use events from store if already loaded
    if (storeEvents && storeEvents.length > 0) {
      console.log('Using existing store events');
      let filteredEvents = [...storeEvents];
      
      if (actualType !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === actualType);
      }
      
      // Sort by date (closest first)
      const sortedEvents = filteredEvents.sort((a, b) => {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
      });
      
      // Only get upcoming events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = sortedEvents.filter(event => 
        new Date(event.start) >= today
      );
      
      // Limit to specified number
      const limitedEvents = upcomingEvents.slice(0, actualLimit);
      
      setEvents(limitedEvents);
      setLoading(false);
      return;
    }
    
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log('Fetching events for upcoming events list');
        
        const fetchedEvents = await fetchEvents();
        
        // Filter by event type if specified
        let filteredEvents = [...fetchedEvents]; 
        if (actualType !== 'all') {
          filteredEvents = filteredEvents.filter(event => event.type === actualType);
        }
        
        // Sort by date (closest first)
        const sortedEvents = filteredEvents.sort((a, b) => {
          const dateA = new Date(a.start).getTime();
          const dateB = new Date(b.start).getTime();
          return dateA - dateB;
        });
        
        // Only get upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => 
          new Date(event.start) >= today
        );
        
        // Limit to specified number
        const limitedEvents = upcomingEvents.slice(0, actualLimit);
        
        setEvents(limitedEvents);
        console.log(`Loaded ${limitedEvents.length} upcoming events`);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents, actualLimit, actualType, propEvents, storeEvents]);
  
  // Helper to format a date consistently
  const formatDate = (date: string | Date): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  };
  
  const viewEvent = async (event: CalendarEvent) => {
    if (onEventClick) {
      const result = await onEventClick(event);
      return result;
    }
    navigate(`/dashboard/calendar?event=${event.id}`);
    return true;
  };
  
  const containerStyle = maxHeight ? { maxHeight, overflowY: 'auto' as const } : {};
  
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
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
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No upcoming events scheduled</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`} style={containerStyle}>
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" 
          onClick={() => viewEvent(event)}
        >
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
              {event.time && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{event.time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {events.length > 0 && !onEventClick && (
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
