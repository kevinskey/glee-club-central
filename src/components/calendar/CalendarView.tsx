
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/types/calendar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { getEventTypeColor } from '@/utils/eventTypes';
import { getNationalHolidays } from '@/utils/nationalHolidays';
import { getSpelmanAcademicDates } from '@/utils/spelmanAcademicDates';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  showPrivateEvents?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  showPrivateEvents = true
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Filter events based on showPrivateEvents prop
  const filteredEvents = useMemo(() => {
    if (showPrivateEvents) {
      return events;
    }
    return events.filter(event => !event.is_private);
  }, [events, showPrivateEvents]);

  // Get events for the selected date
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter(event => 
      isSameDay(parseISO(event.start_time), selectedDate)
    );
  }, [filteredEvents, selectedDate]);

  // Get all dates in the current month that have events
  const eventDates = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.filter(date => 
      filteredEvents.some(event => isSameDay(parseISO(event.start_time), date))
    );
  }, [filteredEvents, currentMonth]);

  // Get holidays and academic dates for the current month
  const monthHolidays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    const nationalHolidays = getNationalHolidays(currentMonth.getFullYear());
    const holidays = nationalHolidays.filter(holiday => {
      const holidayDate = holiday.date;
      return holidayDate >= monthStart && holidayDate <= monthEnd;
    });
    
    const spelmanAcademicDates = getSpelmanAcademicDates(currentMonth.getFullYear());
    const academicDates = spelmanAcademicDates.filter(date => {
      const academicDate = date.date;
      return academicDate >= monthStart && academicDate <= monthEnd;
    });
    
    return { holidays, academicDates };
  }, [currentMonth]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold dark:text-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousMonth}
                className="dark:border-border dark:hover:bg-muted/40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                className="dark:border-border dark:hover:bg-muted/40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{
                hasEvents: eventDates,
                holiday: monthHolidays.holidays.map(h => h.date),
                academic: monthHolidays.academicDates.map(d => d.date)
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: 'rgb(79 158 232 / 0.2)',
                  fontWeight: 'bold'
                },
                holiday: {
                  backgroundColor: 'rgb(239 68 68 / 0.2)',
                  color: 'rgb(239 68 68)'
                },
                academic: {
                  backgroundColor: 'rgb(168 85 247 / 0.2)',
                  color: 'rgb(168 85 247)'
                }
              }}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Events for Selected Date */}
      <div className="space-y-4">
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center dark:text-foreground">
              <CalendarIcon className="h-5 w-5 mr-2 text-glee-spelman dark:text-blue-400" />
              {format(selectedDate, 'EEEE, MMMM d')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 dark:border-border dark:hover:bg-muted/40 transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm dark:text-foreground">{event.title}</h4>
                    {event.event_type && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getEventTypeColor(event.event_type)} dark:bg-muted dark:text-foreground`}
                      >
                        {event.event_type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(parseISO(event.start_time), 'h:mm a')}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location_name}
                      </div>
                    )}
                    {event.short_description && (
                      <p className="text-xs mt-1 dark:text-gray-300">
                        {event.short_description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground dark:text-gray-400">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events on this date</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="dark:bg-card/50 dark:border-border/50">
          <CardHeader>
            <CardTitle className="text-sm dark:text-foreground">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-blue-500/20 rounded border border-blue-500/50"></div>
              <span className="dark:text-gray-300">Events</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-red-500/20 rounded border border-red-500/50"></div>
              <span className="dark:text-gray-300">Holidays</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-purple-500/20 rounded border border-purple-500/50"></div>
              <span className="dark:text-gray-300">Academic Dates</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
