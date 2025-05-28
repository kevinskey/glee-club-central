
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { formatEventDate, formatEventTime } from '@/utils/calendarUtils';

interface NextEventCountdownProps {
  event: CalendarEvent;
}

export function NextEventCountdown({ event }: NextEventCountdownProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(event.start_time);
      const difference = eventDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    
    return () => clearInterval(timer);
  }, [event.start_time]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Next Event: {event.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-lg">{event.title}</p>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formatEventDate(event.start_time)}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <Clock className="mr-1 h-4 w-4" />
              <span>
                {formatEventTime(event.start_time)}
                {event.location_name && ` • ${event.location_name}`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-muted p-2 rounded-md">
              <div className="text-2xl font-bold">{countdown.days}</div>
              <div className="text-xs uppercase text-muted-foreground">Days</div>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <div className="text-2xl font-bold">{countdown.hours}</div>
              <div className="text-xs uppercase text-muted-foreground">Hours</div>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <div className="text-2xl font-bold">{countdown.minutes}</div>
              <div className="text-xs uppercase text-muted-foreground">Mins</div>
            </div>
            <div className="bg-muted p-2 rounded-md">
              <div className="text-2xl font-bold">{countdown.seconds}</div>
              <div className="text-xs uppercase text-muted-foreground">Secs</div>
            </div>
          </div>
          
          <Button variant="outline" className="flex-shrink-0">
            Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
