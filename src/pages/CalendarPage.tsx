
import React from 'react';
import { Layout } from '@/components/landing/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { ViewEventModal } from '@/components/calendar/ViewEventModal';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState('dayGridMonth');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { fetchEvents } = useCalendarStore();
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const calendarEvents = await fetchEvents();
        if (calendarEvents) {
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);
  
  const handleEventClick = async (event: CalendarEvent): Promise<boolean> => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
    return Promise.resolve(true);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Events Calendar" 
          description="View and register for upcoming performances and events"
        />
        
        <div className="mb-8">
          <CalendarHeader 
            view={view}
            onViewChange={setView}
          />
        </div>
        
        <CalendarContainer 
          events={events}
          view={view}
          onEventClick={handleEventClick}
        />
        
        {isViewModalOpen && selectedEvent && (
          <ViewEventModal 
            open={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            event={selectedEvent}
            userCanEdit={false}
          />
        )}
      </div>
    </Layout>
  );
}
