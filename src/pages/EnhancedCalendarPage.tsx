
import React from 'react';
import { PublicPageWrapper } from '@/components/landing/PublicPageWrapper';
import { EnhancedCalendarView } from '@/components/calendar/EnhancedCalendarView';

export default function EnhancedCalendarPage() {
  return (
    <PublicPageWrapper showTopSlider={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Events & Performances
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with our upcoming performances, rehearsals, and special events
          </p>
        </div>
        <EnhancedCalendarView />
      </div>
    </PublicPageWrapper>
  );
}
