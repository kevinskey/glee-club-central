
import React from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarHero } from './CalendarHero';

export const UpcomingEventsSection: React.FC = () => {
  const { events, loading } = useCalendarEvents();

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-glee-spelman/5 to-glee-purple/5">
        <div className="mx-auto w-full max-w-[1800px] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return <CalendarHero events={events} maxEvents={4} />;
};
