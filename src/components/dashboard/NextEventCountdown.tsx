
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
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

  const createGoogleMapsLink = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };
  
  return (
    <Card className="overflow-hidden mobile-card-padding">
      <CardHeader className="bg-primary text-primary-foreground pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">Next Event: {event.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Event Details */}
          <div className="space-y-2">
            <p className="font-semibold text-base sm:text-lg line-clamp-2">{event.title}</p>
            <div className="space-y-1.5">
              <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                <Calendar className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{formatEventDate(event.start_time)}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                <Clock className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{formatEventTime(event.start_time)}</span>
              </div>
              {event.location_name && (
                <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                  <MapPin className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <a 
                    href={createGoogleMapsLink(event.location_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate flex items-center gap-1"
                  >
                    <span className="truncate">{event.location_name}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Countdown */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-muted rounded-md p-2 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold leading-tight">{countdown.days}</div>
              <div className="text-[10px] sm:text-xs uppercase text-muted-foreground leading-tight">Days</div>
            </div>
            <div className="bg-muted rounded-md p-2 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold leading-tight">{countdown.hours}</div>
              <div className="text-[10px] sm:text-xs uppercase text-muted-foreground leading-tight">Hours</div>
            </div>
            <div className="bg-muted rounded-md p-2 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold leading-tight">{countdown.minutes}</div>
              <div className="text-[10px] sm:text-xs uppercase text-muted-foreground leading-tight">Mins</div>
            </div>
            <div className="bg-muted rounded-md p-2 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold leading-tight">{countdown.seconds}</div>
              <div className="text-[10px] sm:text-xs uppercase text-muted-foreground leading-tight">Secs</div>
            </div>
          </div>
          
          {/* Add to Calendar Button */}
          <Button variant="outline" className="w-full mobile-touch-target text-xs sm:text-sm">
            Add to Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
