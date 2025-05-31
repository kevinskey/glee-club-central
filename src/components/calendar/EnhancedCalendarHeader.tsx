
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarPlus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { CalendarViewToggle } from './CalendarViewToggle';

export interface EnhancedCalendarHeaderProps {
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
  onAddEvent?: () => void;
  onResetCalendar?: () => Promise<boolean>;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  userCanCreate?: boolean;
}

export const EnhancedCalendarHeader: React.FC<EnhancedCalendarHeaderProps> = ({
  onAddEvent,
  view,
  onViewChange,
  onResetCalendar,
  onPrevious,
  onNext,
  onToday,
  userCanCreate = true
}) => {
  return (
    <Card className="p-3 sm:p-4 mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {userCanCreate && onAddEvent && (
          <Button
            variant="default"
            size="sm"
            onClick={onAddEvent}
            className="bg-glee-spelman hover:bg-glee-spelman/90 text-white border-glee-spelman hover:border-glee-spelman/90"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create Event</span>
            <span className="sm:hidden">Create</span>
          </Button>
        )}
        
        {onResetCalendar && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetCalendar}
            className="hidden sm:flex"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {onPrevious && onNext && onToday && (
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPrevious} 
              className="rounded-none border-0 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToday} 
              className="rounded-none border-0 border-l border-r px-3 text-xs sm:text-sm"
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNext} 
              className="rounded-none border-0 px-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <CalendarViewToggle
          currentView={view}
          onViewChange={onViewChange}
          className="w-full sm:w-auto"
        />
      </div>
    </Card>
  );
};
