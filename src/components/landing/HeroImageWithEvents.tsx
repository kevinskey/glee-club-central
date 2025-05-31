
import React from "react";

interface HeroImageWithEventsProps {
  className?: string;
}

export default function HeroImageWithEvents({ className }: HeroImageWithEventsProps) {
  return (
    <div className={className}>
      <div className="relative h-full w-full bg-gradient-to-r from-glee-purple to-glee-spelman">
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">Glee Club Events</h2>
        </div>
      </div>
    </div>
  );
}

// Named export for backward compatibility
export { HeroImageWithEvents };
