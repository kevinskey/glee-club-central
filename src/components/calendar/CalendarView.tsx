
import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CalendarHeader } from './CalendarHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface CalendarViewProps {
  view?: 'month' | 'week' | 'day';
  date?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  events?: CalendarEvent[];
  showPrivateEvents?: boolean;
}

export function CalendarView({ 
  view = 'month', 
  date = new Date(), 
  onEventClick = () => {},
  events = [],
  showPrivateEvents = false 
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, day);
    });
  };

  const formatEventTime = (startTime: string) => {
    const date = new Date(startTime);
    return format(date, 'h:mm a');
  };

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case 'concert':
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tour':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isMobile) {
    // Mobile: List view
    return (
      <div className="space-y-4">
        <CalendarHeader 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
          isMobile={isMobile}
        />
        
        <div className="space-y-3">
          {events.length > 0 ? (
            events
              .filter(event => {
                const eventDate = new Date(event.start_time);
                return isSameMonth(eventDate, selectedDate);
              })
              .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .map((event) => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-5 w-5 text-glee-spelman" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(event.start_time), 'EEE, MMM d • h:mm a')}
                        </div>
                        {event.location_name && (
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="truncate">{event.location_name}</span>
                          </div>
                        )}
                        {event.short_description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {event.short_description}
                          </p>
                        )}
                        {event.event_type && (
                          <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
                <Calendar className="h-8 w-8 text-gray-400" />
                <p className="text-gray-500 text-center">
                  No events found for {format(selectedDate, 'MMMM yyyy')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Desktop: Calendar grid view
  return (
    <div className="space-y-4">
      <CalendarHeader 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate}
        isMobile={isMobile}
      />
      
      <div className="grid grid-cols-7 gap-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header row */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 dark:bg-gray-700 p-3 text-center font-medium text-sm text-gray-700 dark:text-gray-300">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[120px] p-2 border-t border-gray-200 dark:border-gray-600 ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <Button
                    key={event.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start p-1 h-auto text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="truncate">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-gray-500">{formatEventTime(event.start_time)}</div>
                    </div>
                  </Button>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
