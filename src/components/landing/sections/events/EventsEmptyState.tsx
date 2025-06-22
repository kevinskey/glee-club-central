
import React from "react";
import { CalendarDays } from "lucide-react";

export function EventsEmptyState() {
  return (
    <div className="text-center py-8">
      <CalendarDays className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm md:text-base text-muted-foreground">
        No upcoming events scheduled at this time
      </p>
    </div>
  );
}
