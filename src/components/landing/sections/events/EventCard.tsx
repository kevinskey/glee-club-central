
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    start_time: string;
    location_name?: string;
    short_description?: string;
    event_type?: string;
    feature_image_url?: string;
  };
  isMobile?: boolean;
}

export function EventCard({ event, isMobile = false }: EventCardProps) {
  const cardClasses = isMobile 
    ? "flex-shrink-0 w-80 snap-start hover:shadow-lg transition-all duration-300"
    : "w-full hover:shadow-lg transition-shadow";

  return (
    <Card className={cardClasses}>
      <div className="relative">
        {/* Event Image */}
        {event.feature_image_url && (
          <div className={`w-full overflow-hidden rounded-t-lg ${isMobile ? 'h-32' : 'h-48'}`}>
            <img
              src={event.feature_image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Event Type Badge */}
        {event.event_type && (
          <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-3 left-3'}`}>
            <span className={`inline-flex items-center font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm ${
              isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'
            }`}>
              {event.event_type}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className={isMobile ? "p-4" : "p-6"}>
        <div className={`flex items-start ${isMobile ? 'gap-3' : 'gap-4'}`}>
          {/* Date Block */}
          <div className="flex-shrink-0">
            <div className={`bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary ${
              isMobile ? 'w-12 h-12 text-xs' : 'w-16 h-16'
            }`}>
              <span className={isMobile ? "font-medium" : "text-sm font-medium"}>
                {format(new Date(event.start_time), 'MMM')}
              </span>
              <span className={isMobile ? "text-sm font-bold" : "text-xl font-bold"}>
                {format(new Date(event.start_time), 'd')}
              </span>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold mb-2 text-foreground ${
              isMobile ? 'text-sm line-clamp-2' : 'text-lg'
            }`}>
              {event.title}
            </h3>
            
            <div className="space-y-1">
              <div className={`flex items-center text-muted-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                <Clock className={`mr-1 flex-shrink-0 ${isMobile ? 'w-3 h-3' : 'w-4 h-4 mr-2'}`} />
                <span>{format(new Date(event.start_time), 'h:mm a')}</span>
              </div>
              
              {event.location_name && (
                <div className={`flex items-center text-muted-foreground ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  <MapPin className={`mr-1 flex-shrink-0 ${isMobile ? 'w-3 h-3' : 'w-4 h-4 mr-2'}`} />
                  <span className={isMobile ? "truncate" : ""}>{event.location_name}</span>
                </div>
              )}
            </div>
            
            {event.short_description && (
              <p className={`text-muted-foreground mt-2 ${
                isMobile ? 'text-xs line-clamp-2' : 'line-clamp-2'
              }`}>
                {event.short_description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
