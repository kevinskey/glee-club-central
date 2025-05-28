
import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfDay, getDay } from 'date-fns';
import { getNationalHolidays, getHolidayByDate } from '@/utils/nationalHolidays';
import { HolidayCard } from './HolidayCard';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getSpelmanAcademicDates, getSpelmanDateByDate } from '@/utils/spelmanAcademicDates';
import { SpelmanDateCard } from './SpelmanDateCard';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  showPrivateEvents?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onEventClick, 
  showPrivateEvents = false 
}) => {
  // Ensure we're using the correct current date - May 28, 2025 (Wednesday)
  const today = new Date(2025, 4, 28); // Month is 0-indexed, so 4 = May
  const [currentDate, setCurrentDate] = useState(startOfDay(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(today));
  const [view, setView] = useState<'month' | 'list'>('month');

  const { settings } = useSiteSettings();
  
  // Check if national holidays should be shown (default to true if setting doesn't exist)
  const showNationalHolidays = settings.show_national_holidays !== false;
  
  // Check if Spelman academic dates should be shown (default to true if setting doesn't exist)
  const showSpelmanAcademicDates = settings.show_spelman_academic_dates !== false;

  // Get all days for the calendar grid (including padding days from previous/next month)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const calendarStart = startOfDay(new Date(monthStart));
  const startDayOfWeek = getDay(calendarStart);
  const paddedStart = new Date(calendarStart);
  paddedStart.setDate(paddedStart.getDate() - startDayOfWeek);
  
  const calendarEnd = startOfDay(new Date(monthEnd));
  const endDayOfWeek = getDay(calendarEnd);
  const paddedEnd = new Date(calendarEnd);
  paddedEnd.setDate(paddedEnd.getDate() + (6 - endDayOfWeek));
  
  const calendarDays = eachDayOfInterval({ start: paddedStart, end: paddedEnd });

  const filteredEvents = events.filter(event => 
    showPrivateEvents || !event.is_private
  );

  const holidays = showNationalHolidays ? getNationalHolidays(currentDate.getFullYear()) : [];
  const spelmanDates = showSpelmanAcademicDates ? getSpelmanAcademicDates(currentDate.getFullYear()) : [];

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const getHolidayForDate = (date: Date) => {
    return showNationalHolidays ? getHolidayByDate(date) : null;
  };

  const getSpelmanDateForDate = (date: Date) => {
    return showSpelmanAcademicDates ? getSpelmanDateByDate(date) : null;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(startOfDay(today));
    setSelectedDate(startOfDay(today));
  };

  const isCurrentDay = (date: Date) => {
    return isSameDay(date, today);
  };

  const isSelectedDay = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const handleDayClick = (date: Date) => {
    const dayStartOfDay = startOfDay(date);
    setSelectedDate(dayStartOfDay);
    
    // If clicking on a day from previous/next month, navigate to that month
    if (!isSameMonth(date, currentDate)) {
      setCurrentDate(dayStartOfDay);
    }
  };

  const getDayClasses = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isTodayDate = isCurrentDay(day);
    const isSelected = isSelectedDay(day);
    const hasHoliday = getHolidayForDate(day);
    const hasSpelmanDate = getSpelmanDateForDate(day);
    
    let classes = 'min-h-[60px] sm:min-h-[80px] p-1 border rounded cursor-pointer transition-colors hover:bg-muted/30 ';
    
    if (isCurrentMonth) {
      classes += 'bg-background ';
    } else {
      classes += 'bg-muted/50 ';
    }
    
    if (hasHoliday) {
      classes += 'bg-gradient-to-br from-red-50 via-white to-blue-50 border-red-300 shadow-sm ';
    } else if (hasSpelmanDate) {
      classes += 'bg-gradient-to-br from-orange-50 via-white to-orange-50 border-orange-300 shadow-sm ';
    }
    
    if (isTodayDate) {
      classes += 'ring-2 ring-orange-500 bg-orange-50 ';
    }
    
    if (isSelected && !isTodayDate) {
      classes += 'ring-2 ring-blue-500 bg-blue-50 ';
    }
    
    return classes;
  };

  const getDayNumberClasses = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isTodayDate = isCurrentDay(day);
    const isSelected = isSelectedDay(day);
    const hasHoliday = getHolidayForDate(day);
    const hasSpelmanDate = getSpelmanDateForDate(day);
    
    let classes = 'text-xs sm:text-sm font-medium ';
    
    if (isCurrentMonth) {
      classes += 'text-foreground ';
    } else {
      classes += 'text-muted-foreground ';
    }
    
    if (hasHoliday) {
      classes += 'font-bold text-blue-800 ';
    } else if (hasSpelmanDate) {
      classes += 'font-bold text-orange-800 ';
    } else if (isTodayDate) {
      classes += 'font-bold text-orange-600 ';
    } else if (isSelected) {
      classes += 'font-bold text-blue-600 ';
    }
    
    return classes;
  };

  const createGoogleMapsLink = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500 mobile-card-padding"
      onClick={() => onEventClick?.(event)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base leading-tight mb-2 line-clamp-2">{event.title}</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">
                  {format(new Date(event.start_time), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {event.location_name && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <a 
                    href={createGoogleMapsLink(event.location_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">{event.location_name}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              )}
              {event.allow_rsvp && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>RSVP Available</span>
                </div>
              )}
            </div>
            {event.short_description && (
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">{event.short_description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {event.is_private && (
              <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 text-xs px-2 py-1 rounded whitespace-nowrap">
                Private
              </span>
            )}
            {event.image_url && (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden border">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 mobile-container">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">{format(currentDate, 'MMMM yyyy')}</span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm">
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView(view === 'month' ? 'list' : 'month')} className="text-xs sm:text-sm">
                {view === 'month' ? 'List' : 'Month'}
              </Button>
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="rounded-r-none">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="rounded-l-none border-l-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-1 sm:p-2 text-center font-medium text-xs sm:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const holiday = getHolidayForDate(day);
                const spelmanDate = getSpelmanDateForDate(day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={getDayClasses(day)}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className={getDayNumberClasses(day)}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 mt-1">
                      {/* Show holiday first if present */}
                      {holiday && (
                        <div className="text-[10px] sm:text-xs p-0.5 sm:p-1 rounded bg-gradient-to-r from-red-100 via-white to-blue-100 text-blue-800 border border-red-200 truncate font-medium shadow-sm">
                          <span className="hidden sm:inline">{holiday.title}</span>
                          <span className="sm:hidden">Holiday</span>
                        </div>
                      )}
                      {/* Show Spelman date if present and no holiday */}
                      {!holiday && spelmanDate && (
                        <div className="text-[10px] sm:text-xs p-0.5 sm:p-1 rounded bg-gradient-to-r from-orange-100 via-white to-orange-100 text-orange-800 border border-orange-200 truncate font-medium shadow-sm">
                          <span className="hidden sm:inline">{spelmanDate.title}</span>
                          <span className="sm:hidden">Academic</span>
                        </div>
                      )}
                      {/* Show events */}
                      {dayEvents.slice(0, (holiday || spelmanDate) ? 1 : 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded cursor-pointer truncate ${
                            event.is_private ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event);
                          }}
                        >
                          <span className="hidden sm:inline">{event.title}</span>
                          <span className="sm:hidden">Event</span>
                        </div>
                      ))}
                      {/* Show more indicator */}
                      {(dayEvents.length + ((holiday || spelmanDate) ? 1 : 0)) > 2 && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                          +{dayEvents.length + ((holiday || spelmanDate) ? 1 : 0) - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* Show holidays in list view only if enabled */}
              {showNationalHolidays && holidays
                .filter(holiday => 
                  holiday.date.getMonth() === currentDate.getMonth() &&
                  holiday.date.getFullYear() === currentDate.getFullYear()
                )
                .map(holiday => (
                  <HolidayCard key={holiday.id} holiday={holiday} />
                ))}
              
              {/* Show Spelman academic dates in list view only if enabled */}
              {showSpelmanAcademicDates && spelmanDates
                .filter(spelmanDate => 
                  spelmanDate.date.getMonth() === currentDate.getMonth() &&
                  spelmanDate.date.getFullYear() === currentDate.getFullYear()
                )
                .map(spelmanDate => (
                  <SpelmanDateCard key={spelmanDate.id} spelmanDate={spelmanDate} />
                ))}
              
              {/* Show regular events */}
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Holiday Details Card for Selected Date */}
      {selectedDate && showNationalHolidays && (() => {
        const selectedHoliday = getHolidayForDate(selectedDate);
        return selectedHoliday ? (
          <HolidayCard holiday={selectedHoliday} />
        ) : null;
      })()}

      {/* Spelman Date Details Card for Selected Date */}
      {selectedDate && showSpelmanAcademicDates && (() => {
        const selectedSpelmanDate = getSpelmanDateForDate(selectedDate);
        return selectedSpelmanDate ? (
          <SpelmanDateCard spelmanDate={selectedSpelmanDate} />
        ) : null;
      })()}
    </div>
  );
};
