
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

// Sample events data since calendar functionality is removed
const sampleEvents = [
  {
    id: '1',
    title: 'Weekly Rehearsal',
    type: 'rehearsal',
    date: '2024-02-15',
    time: '7:00 PM',
    location: 'Music Building, Room 101',
    description: 'Regular rehearsal for current repertoire'
  },
  {
    id: '2',
    title: 'Spring Concert',
    type: 'concert',
    date: '2024-04-20',
    time: '7:30 PM',
    location: 'Sisters Chapel',
    description: 'Annual spring showcase performance'
  },
  {
    id: '3',
    title: 'Soprano Sectional',
    type: 'sectional',
    date: '2024-02-18',
    time: '6:00 PM',
    location: 'Music Building, Room 205',
    description: 'Voice part rehearsal for sopranos'
  }
];

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
          {sampleEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-glee-purple">
                    {event.title}
                  </CardTitle>
                  <Badge className={getEventTypeColor(event.type)}>
                    {formatEventType(event.type)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <p className="text-gray-700 text-sm">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
