
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfMonth, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEvent } from '@/types/calendar';
import { nationalHolidays } from '@/utils/nationalHolidays';
import { spelmanAcademicDates } from '@/utils/spelmanAcademicDates';
import { HolidayCard } from './HolidayCard';
import { SpelmanDateCard } from './SpelmanDateCard';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  showPrivateEvents?: boolean;
}

export function CalendarView({ events, onEventClick, showPrivateEvents = false }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const { getSetting } = useSiteSettings();
  
  const showNationalHolidays = getSetting('showNationalHolidays', true);
  const showSpelmanDates = getSetting('showSpelmanAcademicDates', true);

  // Filter events based on privacy settings
  const filteredEvents = events.filter(event => {
    if (showPrivateEvents) return true;
    return !event.is_private;
  });

  // Get holidays for current month if enabled
  const currentMonthHolidays = showNationalHolidays 
    ? nationalHolidays.filter(holiday => {
        const holidayDate = new Date(currentDate.getFullYear(), holiday.month - 1, holiday.day);
        return holidayDate.getMonth() === currentDate.getMonth() && 
               holidayDate.getFullYear() === currentDate.getFullYear();
      })
    : [];

  // Get Spelman dates for current month if enabled
  const currentMonthSpelmanDates = showSpelmanDates 
    ? spelmanAcademicDates.filter(date => {
        const spelmanDate = new Date(currentDate.getFullYear(), date.month - 1, date.day);
        return spelmanDate.getMonth() === currentDate.getMonth() && 
               spelmanDate.getFullYear() === currentDate.getFullYear();
      })
    : [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, day);
    });
  };

  const getHolidaysForDay = (day: Date) => {
    return currentMonthHolidays.filter(holiday => {
      const holidayDate = new Date(day.getFullYear(), holiday.month - 1, holiday.day);
      return isSameDay(holidayDate, day);
    });
  };

  const getSpelmanDatesForDay = (day: Date) => {
    return currentMonthSpelmanDates.filter(date => {
      const spelmanDate = new Date(day.getFullYear(), date.month - 1, date.day);
      return isSameDay(spelmanDate, day);
    });
  };

  const createGoogleMapsLink = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const formatEventTime = (dateTime: string) => {
    return format(new Date(dateTime), 'h:mm a');
  };

  return (
    <div className="mobile-container space-y-4 sm:space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="mobile-touch-target"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg sm:text-xl font-semibold text-center min-w-[140px] sm:min-w-[160px]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="mobile-touch-target"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg mobile-full-width sm:w-auto">
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="flex-1 sm:flex-none text-xs sm:text-sm mobile-touch-target"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="flex-1 sm:flex-none text-xs sm:text-sm mobile-touch-target"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid border border-border rounded-lg overflow-hidden bg-background">
        {/* Day headers */}
        <div className="calendar-grid bg-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
          <div key={weekIndex} className="calendar-grid">
            {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => {
              const dayEvents = getEventsForDay(day);
              const dayHolidays = getHolidaysForDay(day);
              const daySpelmanDates = getSpelmanDatesForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`mobile-calendar-day border-r border-b border-border last:border-r-0 last:border-b-0 ${
                    !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : 'bg-background'
                  } ${isDayToday ? 'bg-primary/5 border-primary' : ''}`}
                >
                  <div className={`text-xs sm:text-sm font-medium p-1 sm:p-2 ${
                    isDayToday ? 'text-primary font-semibold' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="calendar-day-content px-1 sm:px-2 pb-1 sm:pb-2">
                    {/* Events */}
                    {dayEvents.slice(0, 2).map((event, index) => (
                      <div
                        key={`${event.id}-${index}`}
                        onClick={() => onEventClick(event)}
                        className="event-card-mobile bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-sm p-1 mb-1 cursor-pointer text-[10px] sm:text-xs leading-tight"
                      >
                        <div className="font-medium truncate" title={event.title}>
                          {event.title}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground">
                          <Clock className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                          <span className="truncate">{formatEventTime(event.start_time)}</span>
                        </div>
                        {event.location_name && (
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground">
                            <MapPin className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                            <span className="truncate">{event.location_name}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* More events indicator */}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}

                    {/* Holidays */}
                    {dayHolidays.map((holiday, index) => (
                      <HolidayCard key={`holiday-${index}`} holiday={holiday} />
                    ))}

                    {/* Spelman Dates */}
                    {daySpelmanDates.map((date, index) => (
                      <SpelmanDateCard key={`spelman-${index}`} spelmanDate={date} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: Upcoming Events List */}
      <div className="block sm:hidden">
        <h3 className="text-base font-semibold mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {filteredEvents
            .filter(event => new Date(event.start_time) >= new Date())
            .slice(0, 5)
            .map((event) => (
              <Card 
                key={event.id} 
                className="event-card-mobile cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <CardContent className="mobile-card-padding">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1" title={event.title}>
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                          <span>{format(new Date(event.start_time), 'MMM d')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{formatEventTime(event.start_time)}</span>
                        </div>
                      </div>
                      {event.location_name && (
                        <a
                          href={createGoogleMapsLink(event.location_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.location_name}</span>
                          <ExternalLink className="h-2 w-2 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
