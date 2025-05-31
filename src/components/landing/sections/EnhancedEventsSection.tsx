
import React from 'react';
import { PublicEventScroller } from '@/components/calendar/PublicEventScroller';

interface EnhancedEventsSectionProps {
  className?: string;
}

export function EnhancedEventsSection({ className = "" }: EnhancedEventsSectionProps) {
  return (
    <section className={`bg-gray-50 ${className}`}>
      <PublicEventScroller
        title="Upcoming Performances"
        showViewAllButton={true}
        limit={6}
        className="py-12 sm:py-16"
      />
    </section>
  );
}
