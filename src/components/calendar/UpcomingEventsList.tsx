
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

interface UpcomingEventsListProps {
  limit?: number;
  type?: string;
}

// Sample events data since calendar functionality is removed
const sampleEvents = [
  {
    id: '1',
    title: 'Spring Concert',
    date: '2024-04-20',
    time: '7:30 PM',
    location: 'Sisters Chapel',
    description: 'Annual spring showcase performance'
  },
  {
    id: '2',
    title: 'Weekly Rehearsal',
    date: '2024-02-15',
    time: '7:00 PM',
    location: 'Music Building, Room 101',
    description: 'Regular rehearsal for current repertoire'
  },
  {
    id: '3',
    title: 'Soprano Sectional',
    date: '2024-02-18',
    time: '6:00 PM',
    location: 'Music Building, Room 205',
    description: 'Voice part rehearsal for sopranos'
  }
];

export function UpcomingEventsList({ limit = 5, type }: UpcomingEventsListProps) {
  const events = sampleEvents.slice(0, limit);

  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No upcoming events at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-glee-purple">{event.title}</h3>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            
            {event.description && (
              <p className="text-sm text-gray-700 mt-2">
                {event.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
