
import React from "react";

interface EventsSectionHeaderProps {
  showHeader: boolean;
}

export function EventsSectionHeader({ showHeader }: EventsSectionHeaderProps) {
  if (!showHeader) return null;

  return (
    <div className="text-center mb-6 md:mb-8">
      <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Upcoming Events</h2>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
        Join us for our upcoming performances and community events
      </p>
    </div>
  );
}
