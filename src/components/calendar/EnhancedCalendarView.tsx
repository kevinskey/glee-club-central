
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarHeader } from './CalendarHeader';
import { CalendarView } from './CalendarView';
import { EventDialog } from './EventDialog';

export interface EnhancedCalendarViewProps {
  searchQuery?: string;
  activeTab?: string;
  calendarView?: string;
  selectedEventTypes?: string[];
  view?: string;
}

export function EnhancedCalendarView({ 
  searchQuery, 
  activeTab, 
  calendarView, 
  selectedEventTypes,
  view 
}: EnhancedCalendarViewProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-4">
      <CalendarHeader 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isMobile={false}
      />
      
      <CalendarView 
        view={view as 'month' | 'week' | 'day' || 'month'}
        date={selectedDate}
        onEventClick={handleEventClick}
      />

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={closeEventDialog}
        event={selectedEvent}
      />
    </div>
  );
}
