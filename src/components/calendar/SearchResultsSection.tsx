
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { format, isSameDay, isToday, isTomorrow } from 'date-fns';
import { getEventTypeLabel, getEventTypeColor } from '@/utils/eventTypes';

interface SearchResultsSectionProps {
  events: CalendarEvent[];
  searchTerm: string;
  onEventClick?: (event: CalendarEvent) => void;
  onShowAllResults: () => void;
  maxResults?: number;
}

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  events,
  searchTerm,
  onEventClick,
  onShowAllResults,
  maxResults = 5
}) => {
  if (!searchTerm || events.length === 0) {
    return null;
  }

  const displayEvents = events.slice(0, maxResults);
  const hasMoreResults = events.length > maxResults;

  const formatEventDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Search className="h-5 w-5 mr-2 text-glee-purple" />
          Search Results for "{searchTerm}"
          <Badge variant="secondary" className="ml-2 text-xs">
            {events.length} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayEvents.map((event) => {
          const startDate = new Date(event.start_time);
          const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);

          return (
            <div
              key={event.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{event.title}</h4>
                  {event.short_description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {event.short_description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatEventDate(startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{format(startDate, 'h:mm a')}</span>
                    </div>
                    {event.location_name && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-32">{event.location_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Event Types */}
                {eventTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {eventTypes.slice(0, 2).map(type => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={`text-xs ${getEventTypeColor(type)}`}
                      >
                        {getEventTypeLabel(type)}
                      </Badge>
                    ))}
                    {eventTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{eventTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {hasMoreResults && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAllResults}
              className="w-full"
            >
              Show All {events.length} Results in Events List
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
