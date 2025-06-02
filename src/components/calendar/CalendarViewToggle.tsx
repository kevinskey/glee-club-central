
import React from 'react';
import { Button } from '@/components/ui/button';

export interface CalendarViewToggleProps {
  view?: string;
  setView?: (view: string) => void;
  selectedView?: string;
  onViewChange?: (view: string) => void;
  currentView?: string;
  className?: string;
}

export function CalendarViewToggle({ 
  view, 
  setView, 
  selectedView, 
  onViewChange,
  currentView,
  className = ""
}: CalendarViewToggleProps) {
  const activeView = currentView || view || selectedView || 'month';
  const handleViewChange = setView || onViewChange || (() => {});

  return (
    <div className={`flex gap-1 bg-muted rounded-lg p-1 ${className}`}>
      {['month', 'week', 'day'].map((viewType) => (
        <Button
          key={viewType}
          variant={activeView === viewType ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleViewChange(viewType)}
          className="capitalize"
        >
          {viewType}
        </Button>
      ))}
    </div>
  );
}
