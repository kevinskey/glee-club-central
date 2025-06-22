
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { MobileResponsiveText } from '@/components/mobile/MobileResponsiveText';
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  type: 'rehearsal' | 'performance' | 'meeting' | 'other';
  attendees?: number;
}

// Mock events for demo
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Weekly Rehearsal',
    start: new Date(2024, 5, 3, 18, 0),
    end: new Date(2024, 5, 3, 20, 0),
    location: 'Music Hall A',
    type: 'rehearsal',
    attendees: 45
  },
  {
    id: '2',
    title: 'Spring Concert',
    start: new Date(2024, 5, 7, 19, 0),
    end: new Date(2024, 5, 7, 21, 0),
    location: 'Spelman Auditorium',
    type: 'performance',
    attendees: 300
  }
];

export function MobileCalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.start, date));
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'rehearsal': return 'bg-blue-500';
      case 'performance': return 'bg-purple-500';
      case 'meeting': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setSelectedDate(prev => addDays(prev, days));
  };

  return (
    <MobileOptimizedContainer className="calendar-mobile-container">
      {/* Header */}
      <div className="dashboard-mobile-section">
        <div className="flex items-center justify-between mb-4">
          <MobileResponsiveText as="h1" size="h3" weight="bold">
            Calendar
          </MobileResponsiveText>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="mobile-button"
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="mobile-button"
            >
              Day
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('prev')}
            className="mobile-button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <MobileResponsiveText size="body-large" weight="medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </MobileResponsiveText>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('next')}
            className="mobile-button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="dashboard-mobile-section">
          <div className="space-y-4">
            {weekDays.map(date => {
              const events = getEventsForDate(date);
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              
              return (
                <Card 
                  key={date.toISOString()}
                  className={`dashboard-mobile-card cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  } ${isCurrentDay ? 'bg-primary/5' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <MobileResponsiveText size="body-small" weight="medium">
                          {format(date, 'EEEE')}
                        </MobileResponsiveText>
                        <MobileResponsiveText size="body-large" weight="bold" className={isCurrentDay ? 'text-primary' : ''}>
                          {format(date, 'd')}
                        </MobileResponsiveText>
                      </div>
                      {events.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {events.length} event{events.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  {events.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {events.map(event => (
                          <div key={event.id} className="calendar-mobile-event">
                            <div className="calendar-mobile-event-time">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                            </div>
                            <div className="calendar-mobile-event-title">
                              {event.title}
                            </div>
                            {event.location && (
                              <div className="calendar-mobile-event-location">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees && (
                              <div className="calendar-mobile-event-location">
                                <Users className="h-3 w-3 inline mr-1" />
                                {event.attendees} attendees
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                  
                  {events.length === 0 && (
                    <CardContent className="pt-0">
                      <MobileResponsiveText size="body-small" className="text-muted-foreground text-center">
                        No events scheduled
                      </MobileResponsiveText>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="dashboard-mobile-section">
          <Card className="dashboard-mobile-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="calendar-mobile-event">
                      <div className="flex items-start justify-between mb-2">
                        <div className="calendar-mobile-event-title">
                          {event.title}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs text-white ${getEventTypeColor(event.type)}`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <div className="calendar-mobile-event-time">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                      </div>
                      {event.location && (
                        <div className="calendar-mobile-event-location">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="calendar-mobile-event-location">
                          <Users className="h-3 w-3 inline mr-1" />
                          {event.attendees} attendees
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="mobile-button flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="mobile-button flex-1">
                          RSVP
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <MobileResponsiveText size="body-small" className="text-muted-foreground">
                    No events scheduled for this day
                  </MobileResponsiveText>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </MobileOptimizedContainer>
  );
}
