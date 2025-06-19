
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
    <section className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 py-8 md:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-full px-4 md:px-6 lg:px-8">
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
