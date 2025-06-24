
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventsLoadingState } from './sections/events/EventsLoadingState';

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'concert':
      return 'bg-glee-purple text-white';
    case 'rehearsal':
      return 'bg-glee-spelman text-white';
    case 'sectional':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const formatEventType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function EventsSlider() {
  const { events, loading, error } = useCalendarEvents();

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with our rehearsals, concerts, and special events
            </p>
          </div>
          <EventsLoadingState />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unable to load events at this time
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Filter to only show public events and upcoming events
  const upcomingEvents = events
    .filter(event => !event.is_private && new Date(event.start_time) > new Date())
    .slice(0, 6);

  if (upcomingEvents.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No upcoming events scheduled at this time
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our rehearsals, concerts, and special events
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-glee-purple">
                    {event.title}
                  </CardTitle>
                  {event.event_types && event.event_types.length > 0 && (
                    <Badge className={getEventTypeColor(event.event_types[0])}>
                      {formatEventType(event.event_types[0])}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{new Date(event.start_time).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</span>
                </div>
                
                {event.location_name && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location_name}</span>
                  </div>
                )}
                
                {event.short_description && (
                  <p className="text-gray-700 text-sm">
                    {event.short_description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
