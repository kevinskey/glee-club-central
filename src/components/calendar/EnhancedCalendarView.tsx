
import React, { useState } from 'react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Calendar, CalendarCheck } from 'lucide-react';

interface EnhancedCalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  showPrivateEvents: boolean;
}

export function EnhancedCalendarView({ events, onEventClick, showPrivateEvents }: EnhancedCalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
          <Button
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('month')}
            className="text-xs px-2 py-1 h-7"
          >
            <CalendarDays className="h-3 w-3 mr-1" />
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
            className="text-xs px-2 py-1 h-7"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('day')}
            className="text-xs px-2 py-1 h-7"
          >
            <CalendarCheck className="h-3 w-3 mr-1" />
            Day
          </Button>
        </div>
      </div>

      {/* Calendar Component */}
      <CalendarView
        events={events}
        onEventClick={onEventClick}
        showPrivateEvents={showPrivateEvents}
        viewMode={viewMode}
      />
    </div>
  );
}
