
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isMobile: boolean;
}

export function CalendarHeader({ selectedDate, onDateChange, isMobile }: CalendarHeaderProps) {
  const goToPrevious = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    onDateChange(prevDate);
  };

  const goToNext = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    onDateChange(nextDate);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="sm" onClick={goToPrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h2>
      <Button variant="outline" size="sm" onClick={goToNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
