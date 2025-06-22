
import React from "react";
import { EventCard } from "./EventCard";

interface MobileEventsGridProps {
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

export function MobileEventsGrid({ events }: MobileEventsGridProps) {
  return (
    <div className="block md:hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 pl-4 snap-x snap-mandatory scrollbar-hide">
        {events.map((event) => (
          <EventCard key={event.id} event={event} isMobile={true} />
        ))}
      </div>
    </div>
  );
}
