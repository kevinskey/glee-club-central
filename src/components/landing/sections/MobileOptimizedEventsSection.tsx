
import React from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { EventsSectionHeader } from "./events/EventsSectionHeader";
import { EventsLoadingState } from "./events/EventsLoadingState";
import { EventsErrorState } from "./events/EventsErrorState";
import { EventsEmptyState } from "./events/EventsEmptyState";
import { MobileEventsGrid } from "./events/MobileEventsGrid";
import { DesktopEventsGrid } from "./events/DesktopEventsGrid";

interface MobileOptimizedEventsSectionProps {
  maxEvents?: number;
  showHeader?: boolean;
  className?: string;
}

export function MobileOptimizedEventsSection({ 
  maxEvents = 4, 
  showHeader = true,
  className = ""
}: MobileOptimizedEventsSectionProps) {
  const { events, loading, error } = useCalendarEvents();

  // Filter and sort upcoming public events
  const now = new Date();
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      return isAfter(eventDate, now) && event.is_public;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, maxEvents);

  const sectionClasses = cn("py-8 md:py-12 pt-6 md:pt-20", className);

  if (loading) {
    return (
      <section className={sectionClasses}>
        <div className="w-full">
          <div className="px-4">
            <EventsSectionHeader showHeader={showHeader} />
          </div>
          <EventsLoadingState />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionClasses}>
        <div className="w-full">
          <div className="px-4">
            <EventsErrorState />
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <section className={sectionClasses}>
        <div className="w-full">
          <div className="px-4">
            <EventsSectionHeader showHeader={showHeader} />
            <EventsEmptyState />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClasses}>
      <div className="w-full">
        <div className="px-4">
          <EventsSectionHeader showHeader={showHeader} />
        </div>
        
        <MobileEventsGrid events={upcomingEvents} />
        
        <div className="px-4">
          <DesktopEventsGrid events={upcomingEvents} />
          
          {upcomingEvents.length >= maxEvents && (
            <div className="text-center mt-6 md:mt-8">
              <Button variant="outline" size="sm" className="mobile-button">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
