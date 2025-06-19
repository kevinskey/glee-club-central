
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

interface EnhancedEventsSectionProps {
  events: Event[];
}

export function EnhancedEventsSection({ events }: EnhancedEventsSectionProps) {
  return (
    <section className="bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-900 dark:to-navy-800 py-8 md:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-6 md:px-8">
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
