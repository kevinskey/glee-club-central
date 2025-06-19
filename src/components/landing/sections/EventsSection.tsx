
import React from "react";
import { EventScroller } from "@/components/landing/EventScroller";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section>
      <div className="mx-auto w-full max-w-full">
        <EventScroller 
          events={events}
          title="Upcoming Events"
          showViewAllButton={true}
          onViewAll={() => window.location.href = "/events"}
        />
      </div>
    </section>
  );
}
