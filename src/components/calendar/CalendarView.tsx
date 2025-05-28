import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users } from 'lucide-react';
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
    
    let classes = 'min-h-[80px] p-1 border rounded cursor-pointer transition-colors hover:bg-muted/30 ';
    
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
    
    let classes = 'text-sm ';
    
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView(view === 'month' ? 'list' : 'month')}>
                {view === 'month' ? 'List View' : 'Month View'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                  {day}
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
                    <div className="space-y-1">
                      {/* Show holiday first if present */}
                      {holiday && (
                        <div className="text-xs p-1 rounded bg-gradient-to-r from-red-100 via-white to-blue-100 text-blue-800 border border-red-200 truncate font-medium shadow-sm">
                          {holiday.title}
                        </div>
                      )}
                      {/* Show Spelman date if present and no holiday */}
                      {!holiday && spelmanDate && (
                        <div className="text-xs p-1 rounded bg-gradient-to-r from-orange-100 via-white to-orange-100 text-orange-800 border border-orange-200 truncate font-medium shadow-sm">
                          {spelmanDate.title}
                        </div>
                      )}
                      {/* Show events */}
                      {dayEvents.slice(0, (holiday || spelmanDate) ? 1 : 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer truncate ${
                            event.is_private ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {/* Show more indicator */}
                      {(dayEvents.length + ((holiday || spelmanDate) ? 1 : 0)) > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length + ((holiday || spelmanDate) ? 1 : 0) - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show holidays in list view only if enabled */}
              {showNationalHolidays && holidays
                .filter(holiday => 
                  holiday.date.getMonth() === currentDate.getMonth() &&
                  holiday.date.getFullYear() === currentDate.getFullYear()
                )
                .map(holiday => (
                  <Card key={holiday.id} className="border-red-300 bg-gradient-to-r from-red-50 via-white to-blue-50 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900">{holiday.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(holiday.date, 'MMM d, yyyy')}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-blue-800">{holiday.description}</p>
                        </div>
                        <div className="ml-4 w-16 h-16 rounded overflow-hidden border-2 border-red-200">
                          <img 
                            src={holiday.imageUrl} 
                            alt={holiday.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick?.(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(event.start_time), 'MMM d, yyyy h:mm a')}
                          </div>
                          {event.location_name && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location_name}
                            </div>
                          )}
                          {event.allow_rsvp && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              RSVP
                            </div>
                          )}
                        </div>
                        {event.short_description && (
                          <p className="mt-2 text-sm text-muted-foreground">{event.short_description}</p>
                        )}
                      </div>
                      {event.is_private && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
