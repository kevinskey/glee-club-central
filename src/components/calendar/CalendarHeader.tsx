
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarPlus, ChevronLeft, ChevronRight, RefreshCw, 
  CalendarDays, Calendar, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface CalendarHeaderProps {
  onAddEvent: () => void;
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
  onResetCalendar?: () => Promise<boolean>;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  userCanCreate?: boolean; // Add this prop
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  onAddEvent,
  view,
  onViewChange,
  onResetCalendar,
  onPrevious,
  onNext,
  onToday,
  userCanCreate = true
}) => {
  const isMobile = window.innerWidth < 768; // Simple mobile detection

  return (
    <Card className="p-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddEvent}
          className="flex items-center"
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
        
        {onResetCalendar && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetCalendar}
            className="hidden sm:flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onPrevious && onNext && onToday && (
          <div className="flex items-center mr-2 border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPrevious} 
              className="h-8 w-8 rounded-none rounded-l-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToday} 
              className="h-8 rounded-none border-l border-r px-2"
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNext} 
              className="h-8 w-8 rounded-none rounded-r-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <Select value={view} onValueChange={onViewChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dayGridMonth">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Month
              </div>
            </SelectItem>
            {!isMobile && (
              <SelectItem value="timeGridWeek">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Week
                </div>
              </SelectItem>
            )}
            <SelectItem value="listWeek">
              <div className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                List
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
