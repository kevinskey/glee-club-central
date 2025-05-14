
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/types/calendar';
import { getPerformanceEvents } from '@/utils/performanceSync';
import { EventList } from './EventList';
import { CalendarPlus } from 'lucide-react';

interface UpcomingEventsProps {
  limit?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export const UpcomingEvents = ({ 
  limit = 5,
  showAddButton = false,
  onAddClick
}: UpcomingEventsProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Get performance events from our synchronization utility
        const performanceEvents = await getPerformanceEvents();
        
        // Sort by start date and limit
        const upcomingEvents = performanceEvents
          .filter(event => new Date(event.start) >= new Date())
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, limit);
          
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [limit]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Upcoming Events</h3>
        {showAddButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddClick}
            className="gap-1"
          >
            <CalendarPlus className="h-4 w-4" />
            Add
          </Button>
        )}
      </div>
      <EventList events={events} loading={loading} emptyMessage="No upcoming events" />
    </div>
  );
};
