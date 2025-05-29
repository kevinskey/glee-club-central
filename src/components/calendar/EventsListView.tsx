
import React, { useState, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format, isSameDay, isToday, isTomorrow, isYesterday, startOfToday } from 'date-fns';
import { getEventTypeLabel, getEventTypeColor } from '@/utils/eventTypes';
import { EventTypeDropdown } from './EventTypeDropdown';

interface EventsListViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventTypesChange?: (eventId: string, newTypes: string[]) => void;
  showEventTypeDropdown?: boolean;
  lastChangedEventId?: string;
}

const EVENTS_PER_PAGE = 7;

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  onEventClick,
  onEventTypesChange,
  showEventTypeDropdown = false,
  lastChangedEventId
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter events from today forward and sort chronologically
  const futureEvents = useMemo(() => {
    const today = startOfToday();
    return [...events]
      .filter(event => new Date(event.start_time) >= today)
      .sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
  }, [events]);

  // Calculate pagination
  const totalPages = Math.ceil(futureEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = futureEvents.slice(startIndex, endIndex);

  // Find the page containing the last changed event and navigate to it
  React.useEffect(() => {
    if (lastChangedEventId) {
      const eventIndex = futureEvents.findIndex(event => event.id === lastChangedEventId);
      if (eventIndex !== -1) {
        const targetPage = Math.floor(eventIndex / EVENTS_PER_PAGE) + 1;
        setCurrentPage(targetPage);
      }
    }
  }, [lastChangedEventId, futureEvents]);

  const formatEventDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatEventTime = (startTime: Date, endTime: Date) => {
    const start = format(startTime, 'h:mm a');
    const end = format(endTime, 'h:mm a');
    
    if (isSameDay(startTime, endTime)) {
      return `${start} - ${end}`;
    }
    
    return `${start} - ${format(endTime, 'MMM d, h:mm a')}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Check if an event is a virtual event (holiday or academic date)
  const isVirtualEvent = (event: CalendarEvent) => {
    return event.id.startsWith('holiday-') || event.id.startsWith('spelman-');
  };

  // Handle event click with proper navigation logic
  const handleEventClick = (event: CalendarEvent) => {
    // Don't navigate for virtual events (holidays, academic dates)
    if (isVirtualEvent(event)) {
      return;
    }
    
    onEventClick?.(event);
  };

  // Handle event types change with validation
  const handleEventTypesChange = (eventId: string, newTypes: string[]) => {
    // Don't allow changes for virtual events
    if (eventId.startsWith('holiday-') || eventId.startsWith('spelman-')) {
      return;
    }
    
    onEventTypesChange?.(eventId, newTypes);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    if (currentPage > 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
        </PaginationItem>
      );
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      );
    }

    return items;
  };

  if (futureEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Upcoming Events</h3>
        <p className="text-sm text-muted-foreground">
          There are no events scheduled from today forward.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Events List */}
      <div className="space-y-4">
        {currentEvents.map((event) => {
          const startDate = new Date(event.start_time);
          const endDate = new Date(event.end_time);
          const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);
          const isVirtual = isVirtualEvent(event);
          const isLastChanged = event.id === lastChangedEventId;

          return (
            <Card 
              key={event.id} 
              className={`transition-colors ${isVirtual ? '' : 'cursor-pointer hover:bg-muted/50'} ${
                isLastChanged ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
              }`}
              onClick={() => handleEventClick(event)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col space-y-3">
                  {/* Event Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {event.title}
                      </h3>
                      {event.short_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.short_description}
                        </p>
                      )}
                    </div>
                    
                    {/* Event Types - only show dropdown if allowed */}
                    {showEventTypeDropdown && onEventTypesChange && !isVirtual && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <EventTypeDropdown
                          event={event}
                          onEventTypesChange={handleEventTypesChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    {/* Date */}
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatEventDate(startDate)}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatEventTime(startDate, endDate)}</span>
                    </div>

                    {/* Location */}
                    {event.location_name && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location_name}</span>
                      </div>
                    )}

                    {/* Host */}
                    {event.event_host_name && (
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.event_host_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Special indicators */}
                  <div className="flex gap-2 pt-2 border-t">
                    {event.is_private && (
                      <Badge variant="secondary" className="text-xs">
                        Private Event
                      </Badge>
                    )}
                    {isVirtual && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {event.id.startsWith('holiday-') ? 'Holiday' : 'Academic Date'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
          
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, futureEvents.length)} of {futureEvents.length} upcoming events
          </div>
        </div>
      )}
    </div>
  );
};
