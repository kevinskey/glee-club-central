
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/types/calendar';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent?: (date: Date) => void;
  showPrivateEvents: boolean;
  viewMode: 'month' | 'week' | 'day';
}

export function CalendarView({ events = [], onEventClick, onCreateEvent, showPrivateEvents, viewMode }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEventTypeColor = (type: string) => {
    const colors = {
      rehearsal: 'bg-blue-500',
      performance: 'bg-purple-500',
      meeting: 'bg-green-500',
      social: 'bg-pink-500',
      workshop: 'bg-yellow-500',
      tour: 'bg-red-500',
      holiday: 'bg-red-600',
      religious: 'bg-indigo-600',
      orientation: 'bg-cyan-500',
      registration: 'bg-orange-500',
      classes: 'bg-blue-600',
      exams: 'bg-red-500',
      break: 'bg-green-600',
      deadline: 'bg-yellow-600',
      special: 'bg-purple-600',
      other: 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventsForDate = (date: Date) => {
    if (!events || !Array.isArray(events)) return [];
    return events.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dayEvents = getEventsForDate(day);
    
    // If no events and onCreateEvent is provided, open create event window
    if (dayEvents.length === 0 && onCreateEvent) {
      onCreateEvent(day);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const amount = viewMode === 'month' ? 1 : viewMode === 'week' ? 7 : 1;
    const fn = direction === 'prev' ? (viewMode === 'month' ? subMonths : (d: Date) => addDays(d, -amount)) : (viewMode === 'month' ? addMonths : (d: Date) => addDays(d, amount));
    setSelectedDate(fn(selectedDate, viewMode === 'month' ? 1 : undefined));
  };

  // Early return if events is not properly loaded
  if (!events) {
    return (
      <div className="px-0 md:px-4 lg:px-6">
        <Card>
          <CardContent className="p-3">
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <p className="text-xs text-gray-500">Loading calendar...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Month View
  if (viewMode === 'month') {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const selectedDayEvents = getEventsForDate(selectedDate);

    return (
      <div className="space-y-4 px-0 md:px-4 lg:px-6">
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-sm font-semibold">{format(selectedDate, 'MMMM yyyy')}</h2>
              <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 text-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{day}</span>
                </div>
              ))}
              
              {/* Calendar Days */}
              {weeks.map((week, weekIndex) => 
                week.map((day, dayIndex) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                  const isDayToday = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const hasEvents = dayEvents.length > 0;
                  
                  return (
                    <div 
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "min-h-16 p-2 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative",
                        !isCurrentMonth && "bg-gray-50 dark:bg-gray-800 text-gray-400",
                        isDayToday && "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200",
                        isSelected && "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500"
                      )}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1 flex items-center justify-between",
                        isDayToday ? "text-blue-600" : isCurrentMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
                      )}>
                        <span>{format(day, 'd')}</span>
                        {hasEvents && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id} 
                            className={cn(
                              "text-xs p-0.5 mb-0.5 rounded truncate cursor-pointer transition-opacity hover:opacity-80 text-white",
                              getEventTypeColor(event.event_type || 'other')
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            title={event.title}
                          >
                            {event.title.length > 12 ? `${event.title.substring(0, 12)}...` : event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-center text-muted-foreground font-medium">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Events List */}
        {selectedDayEvents.length > 0 && (
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-3">
                Events for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="space-y-3">
                {selectedDayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <Badge 
                        className={cn("text-xs text-white", getEventTypeColor(event.event_type || 'other'))}
                      >
                        {event.event_type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                      </div>
                      {event.location_name && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {event.location_name}
                        </div>
                      )}
                    </div>
                    
                    {event.short_description && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{event.short_description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Week View
  if (viewMode === 'week') {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="px-0 md:px-4 lg:px-6">
        <Card>
          <CardContent className="p-3 md:p-4 lg:p-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-sm font-semibold">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isDayToday = isToday(day);
                
                return (
                  <div 
                    key={day.toString()} 
                    className={cn(
                      "min-h-24 border rounded-lg p-2 cursor-pointer",
                      isDayToday && "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                    )}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className={cn(
                      "text-xs font-medium mb-2 text-center",
                      isDayToday ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                    )}>
                      <div>{format(day, 'EEE')}</div>
                      <div className="text-sm">{format(day, 'd')}</div>
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs p-1 rounded cursor-pointer hover:opacity-80 text-white",
                            getEventTypeColor(event.event_type || 'other')
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="opacity-75">{format(new Date(event.start_time), 'h:mm a')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Day View
  const dayEvents = getEventsForDate(selectedDate);

  return (
    <div className="px-0 md:px-4 lg:px-6">
      <Card>
        <CardContent className="p-3 md:p-4 lg:p-6">
          {/* Day Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-semibold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Events */}
          {dayEvents.length > 0 ? (
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <Badge 
                      className={cn("text-xs text-white", getEventTypeColor(event.event_type || 'other'))}
                    >
                      {event.event_type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {event.location_name}
                      </div>
                    )}
                  </div>
                  
                  {event.short_description && (
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{event.short_description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 cursor-pointer" onClick={() => onCreateEvent && onCreateEvent(selectedDate)}>
              <Calendar className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <p className="text-xs text-gray-500">No events scheduled for this day</p>
              {onCreateEvent && <p className="text-xs text-blue-500 mt-1">Click to create an event</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
