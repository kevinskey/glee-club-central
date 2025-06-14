
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';

interface CalendarHeroProps {
  events: CalendarEvent[];
  maxEvents?: number;
}

export const CalendarHero: React.FC<CalendarHeroProps> = ({ 
  events, 
  maxEvents = 4 
}) => {
  // Filter to public events only and get upcoming ones
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      const now = new Date();
      return event.is_public && (eventDate > now || isSameDay(eventDate, now));
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, maxEvents);

  const formatEventDate = (startTime: string) => {
    const date = new Date(startTime);
    return format(date, 'EEE, MMM d • h:mm a');
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

  if (upcomingEvents.length === 0) {
    return (
      <section className="py-12 pt-16 md:pt-20 bg-gradient-to-br from-glee-spelman/5 to-glee-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-gray-600">Stay tuned for our next performances!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 pt-16 md:pt-20 bg-gradient-to-br from-glee-spelman/5 to-glee-purple/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
        
        <p className="text-gray-600 max-w-2xl mb-8">
          Join us for unforgettable musical experiences. Don't miss these upcoming performances and events.
        </p>

        {/* Mobile: Scrollable cards */}
        <div className="block lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="flex-shrink-0 w-72 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Calendar className="h-5 w-5 text-glee-spelman" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatEventDate(event.start_time)}
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
                      <div className="flex justify-between items-center">
                        {event.event_type && (
                          <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                        )}
                        <Link to={`/event/${event.id}`}>
                          <Button size="sm" variant="ghost">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-6 w-6 text-glee-spelman" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatEventDate(event.start_time)}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location_name}
                      </div>
                    )}
                    {event.short_description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.short_description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      {event.event_type && (
                        <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      )}
                      <Link to={`/event/${event.id}`}>
                        <Button size="sm">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
