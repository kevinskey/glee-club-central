
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
    <section className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8">
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
