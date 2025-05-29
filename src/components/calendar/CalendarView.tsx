
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEvent } from '@/types/calendar';
import { getNationalHolidays } from '@/utils/nationalHolidays';
import { getSpelmanAcademicDates } from '@/utils/spelmanAcademicDates';
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
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { settings } = useSiteSettings();
  
  const showNationalHolidays = settings.showNationalHolidays ?? true;
  const showSpelmanDates = settings.showSpelmanAcademicDates ?? true;

  // Filter events based on privacy settings
  const filteredEvents = events.filter(event => {
    if (showPrivateEvents) return true;
    return !event.is_private;
  });

  // Get holidays for current period if enabled
  const currentPeriodHolidays = showNationalHolidays 
    ? getNationalHolidays(currentDate.getFullYear()).filter(holiday => {
        if (view === 'month') {
          return holiday.date.getMonth() === currentDate.getMonth() && 
                 holiday.date.getFullYear() === currentDate.getFullYear();
        } else if (view === 'week') {
          const weekStart = startOfWeek(currentDate);
          const weekEnd = endOfWeek(currentDate);
          return holiday.date >= weekStart && holiday.date <= weekEnd;
        }
        return true;
      })
    : [];

  // Get Spelman dates for current period if enabled
  const currentPeriodSpelmanDates = showSpelmanDates 
    ? getSpelmanAcademicDates(currentDate.getFullYear()).filter(date => {
        if (view === 'month') {
          return date.date.getMonth() === currentDate.getMonth() && 
                 date.date.getFullYear() === currentDate.getFullYear();
        } else if (view === 'week') {
          const weekStart = startOfWeek(currentDate);
          const weekEnd = endOfWeek(currentDate);
          return date.date >= weekStart && date.date <= weekEnd;
        }
        return true;
      })
    : [];

  const navigatePeriod = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
      } else if (view === 'week') {
        if (direction === 'prev') {
          return subWeeks(prev, 1);
        } else {
          return addWeeks(prev, 1);
        }
      } else if (view === 'day') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 1);
        } else {
          newDate.setDate(prev.getDate() + 1);
        }
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
    return currentPeriodHolidays.filter(holiday => {
      return isSameDay(holiday.date, day);
    });
  };

  const getSpelmanDatesForDay = (day: Date) => {
    return currentPeriodSpelmanDates.filter(date => {
      return isSameDay(date.date, day);
    });
  };

  const createGoogleMapsLink = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const formatEventTime = (dateTime: string) => {
    return format(new Date(dateTime), 'h:mm a');
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setCurrentDate(day);
    setView('day');
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const dayHolidays = getHolidaysForDay(day);
            const daySpelmanDates = getSpelmanDatesForDay(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-muted/50 ${
                  !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : 'bg-background'
                } ${isDayToday ? 'bg-primary/5 border-primary' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isDayToday ? 'text-primary font-semibold' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {/* Events - Show only title and time, NO descriptions */}
                  {dayEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="bg-primary/10 text-primary rounded-sm p-1 cursor-pointer text-xs leading-tight hover:bg-primary/20 transition-colors"
                    >
                      <div className="font-medium truncate" title={event.title}>
                        {event.title}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2 w-2 flex-shrink-0" />
                        <span className="truncate">{formatEventTime(event.start_time)}</span>
                      </div>
                    </div>
                  ))}

                  {/* More events indicator */}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground font-medium">
                      +{dayEvents.length - 3} more
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
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted border-b">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
            >
              <div className="text-xs">{format(day, 'EEE')}</div>
              <div className={`text-lg font-semibold ${isToday(day) ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Week days grid */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const dayHolidays = getHolidaysForDay(day);
            const daySpelmanDates = getSpelmanDatesForDay(day);
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`min-h-[200px] border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-muted/50 ${
                  isDayToday ? 'bg-primary/5 border-primary' : 'bg-background'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="space-y-1">
                  {/* Events */}
                  {dayEvents.map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="bg-primary/10 text-primary rounded-sm p-2 cursor-pointer text-xs leading-tight hover:bg-primary/20 transition-colors"
                    >
                      <div className="font-medium truncate" title={event.title}>
                        {event.title}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2 w-2 flex-shrink-0" />
                        <span className="truncate">{formatEventTime(event.start_time)}</span>
                      </div>
                    </div>
                  ))}

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
      </div>
    );
  };

  const renderDayView = () => {
    const dayToShow = selectedDay || currentDate;
    const dayEvents = getEventsForDay(dayToShow);
    const dayHolidays = getHolidaysForDay(dayToShow);
    const daySpelmanDates = getSpelmanDatesForDay(dayToShow);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Events for {format(dayToShow, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        
        <div className="space-y-3">
          {dayEvents.length === 0 && dayHolidays.length === 0 && daySpelmanDates.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No events scheduled for this day
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Regular Events */}
              {dayEvents.map((event) => (
                <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEventClick(event)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatEventTime(event.start_time)}</span>
                          </div>
                          {event.location_name && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location_name}</span>
                            </div>
                          )}
                        </div>
                        {event.short_description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {event.short_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Holidays */}
              {dayHolidays.map((holiday, index) => (
                <Card key={`holiday-${index}`}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg text-green-700">{holiday.title}</h4>
                    <p className="text-sm text-muted-foreground">National Holiday</p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Spelman Dates */}
              {daySpelmanDates.map((date, index) => (
                <Card key={`spelman-${index}`}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg text-purple-700">{date.title}</h4>
                    <p className="text-sm text-muted-foreground">Spelman Academic Date</p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  // Get upcoming events for list view
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const renderListView = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Upcoming Events</h3>
      
      <div className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No upcoming events
            </CardContent>
          </Card>
        ) : (
          upcomingEvents.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEventClick(event)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(event.start_time), 'EEE, MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatEventTime(event.start_time)}</span>
                      </div>
                      {event.location_name && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location_name}</span>
                        </div>
                      )}
                    </div>
                    {event.short_description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.short_description}
                      </p>
                    )}
                  </div>
                  {event.event_type && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {event.event_type}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const getHeaderTitle = () => {
    switch (view) {
      case 'day':
        return format(selectedDay || currentDate, 'MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'list':
        return 'All Events';
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigatePeriod('prev')}
            disabled={view === 'list'}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg sm:text-xl font-semibold text-center min-w-[140px] sm:min-w-[200px]">
            {getHeaderTitle()}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigatePeriod('next')}
            disabled={view === 'list'}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="text-xs sm:text-sm"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="text-xs sm:text-sm"
          >
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('day')}
            className="text-xs sm:text-sm"
          >
            Day
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="text-xs sm:text-sm"
          >
            List
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'list' && renderListView()}

      {/* Mobile: Upcoming Events List - only show in month view */}
      {view === 'month' && (
        <div className="block sm:hidden">
          <h3 className="text-base font-semibold mb-3">Upcoming Events</h3>
          <div className="space-y-2">
            {filteredEvents
              .filter(event => new Date(event.start_time) >= new Date())
              .slice(0, 5)
              .map((event) => (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick(event)}
                >
                  <CardContent className="p-3">
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
      )}
    </div>
  );
}
