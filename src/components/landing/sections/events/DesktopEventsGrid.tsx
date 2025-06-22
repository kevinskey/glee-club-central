
import React from "react";
import { EventCard } from "./EventCard";
import { ArrowRight } from "lucide-react";

interface DesktopEventsGridProps {
  events: Array<{
    id: string;
    title: string;
    start_time: string;
    location_name?: string;
    short_description?: string;
    event_type?: string;
    feature_image_url?: string;
  }>;
}

export function DesktopEventsGrid({ events }: DesktopEventsGridProps) {
  return (
    <div className="hidden md:block w-full">
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="group">
            <EventCard event={event} isMobile={false} />
            <div className="flex justify-end mt-4">
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
