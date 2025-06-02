
import React from 'react';

export interface CalendarViewProps {
  view: 'month' | 'week' | 'day';
  date: Date;
  onEventClick: (event: any) => void;
}

export function CalendarView({ view, date, onEventClick }: CalendarViewProps) {
  return (
    <div className="calendar-view">
      <p className="text-center text-muted-foreground">
        Calendar view for {view} view on {date.toDateString()}
      </p>
    </div>
  );
}
