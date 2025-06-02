import React, { useState, useEffect } from 'react';
import { CalendarView } from './CalendarView';
import { CalendarHeader } from './CalendarHeader';
import { EventDialog } from './EventDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedCalendarViewProps {
  isMobile?: boolean;
}

export function EnhancedCalendarView({ isMobile = false }: EnhancedCalendarViewProps) {
  const { user, profile, isLoading } = useAuth();
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setSelectedView(view);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <CalendarHeader
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            isMobile={isMobile}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <CalendarView
          view={selectedView}
          date={selectedDate}
          onEventClick={handleEventClick}
        />
      </CardContent>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={handleCloseEventDialog}
        event={selectedEvent}
      />
    </Card>
  );
}
