
import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format, isAfter, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  showPrivateEvents?: boolean;
}

type ViewMode = 'month' | 'week' | 'list';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  showPrivateEvents = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter and sort events
  const upcomingEvents = events
    .filter(event => isAfter(new Date(event.start_time), new Date()) || isSameDay(new Date(event.start_time), new Date()))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case 'concert':
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rehearsal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tour':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatEventDate = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isSameDay(start, end)) {
      return `${format(start, 'EEE, MMM d')} • ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    } else {
      return `${format(start, 'EEE, MMM d, h:mm a')} - ${format(end, 'EEE, MMM d, h:mm a')}`;
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <Card 
          key={event.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onEventClick(event)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-5 w-5 text-glee-spelman" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatEventDate(event.start_time, event.end_time)}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location_name}
                      </div>
                    )}
                    {event.short_description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{event.short_description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {event.event_type && (
                  <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                    {event.event_type.replace('_', ' ')}
                  </Badge>
                )}
                {event.is_private && showPrivateEvents && (
                  <Badge variant="secondary">Private</Badge>
                )}
                {event.allow_rsvp && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    RSVP Available
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days for proper grid layout
    const startPadding = getDay(monthStart);
    const paddedDays = [
      ...Array(startPadding).fill(null),
      ...monthDays
    ];

    return (
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {paddedDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="bg-white p-2 h-24"></div>;
            }
            
            const dayEvents = upcomingEvents.filter(event => 
              isSameDay(new Date(event.start_time), day)
            );

            return (
              <div key={day.toISOString()} className="bg-white p-1 h-24 overflow-hidden">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-glee-spelman/10 text-glee-spelman cursor-pointer hover:bg-glee-spelman/20 truncate"
                      onClick={() => onEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // For simplicity, show next 7 days with events
    const weekEvents = upcomingEvents.slice(0, 10);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekEvents.map((event) => (
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
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(event.start_time), 'EEE, MMM d • h:mm a')}
                  </div>
                  {event.location_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{event.location_name}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                {event.event_type && (
                  <Badge variant="outline" className={`${getEventTypeColor(event.event_type)} text-xs`}>
                    {event.event_type.replace('_', ' ')}
                  </Badge>
                )}
                {event.allow_rsvp && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    RSVP
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
            
            {viewMode === 'month' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  ←
                </Button>
                <span className="font-medium px-3">
                  {format(currentDate, 'MMMM yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  →
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <div className="min-h-[400px]">
        {viewMode === 'list' && renderListView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
      </div>
    </div>
  );
};
