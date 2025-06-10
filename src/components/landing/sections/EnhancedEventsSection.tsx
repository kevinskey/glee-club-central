
import React from "react";
import { OptimizedPublicEventScroller } from "@/components/calendar/OptimizedPublicEventScroller";

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
  console.log('🎭 EnhancedEventsSection: Received events:', events.length);
  
  return (
    <div className="w-full">
      <div className="text-center mb-16 md:mb-20 lg:mb-24">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-8 md:mb-10 tracking-tight">
          Upcoming Events
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Join us for our upcoming performances and community events
        </p>
      </div>
      
      <OptimizedPublicEventScroller 
        title=""
        showViewAllButton={true}
        limit={6}
        className=""
      />
    </div>
  );
}
