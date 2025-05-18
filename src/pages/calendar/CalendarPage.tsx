
import React, { useEffect, useState } from 'react';
import Calendar from '@/components/dashboard/Calendar';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { CalendarEvent } from '@/types/calendar';
import { Spinner } from '@/components/ui/spinner';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const { fetchEvents } = useCalendarStore();
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await fetchEvents();
        
        // Properly handle the case when fetchEvents returns undefined
        if (fetchedEvents) {
          setEvents(fetchedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading calendar events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Transform events to the format expected by the Calendar component
  const calendarEvents = events.map(event => ({
    date: new Date(event.start),
    title: event.title,
    color: event.type === 'concert' ? 'purple' : 
           event.type === 'rehearsal' ? 'blue' : 
           event.type === 'sectional' ? 'green' : 'orange'
  }));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calendar</h1>
        <Calendar 
          events={calendarEvents}
          month={currentMonth}
          year={currentYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>
    </div>
  );
}
