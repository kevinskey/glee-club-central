
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarResetButton } from './CalendarResetButton';
import { usePermissions } from '@/hooks/usePermissions';

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  onResetCalendar?: () => Promise<boolean>;
}

export function CalendarPageHeader({ 
  onAddEventClick, 
  view, 
  onViewChange,
  onResetCalendar
}: CalendarPageHeaderProps) {
  const { isSuperAdmin } = usePermissions();
  
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-brand" />
          <h1 className="text-xl font-bold">Calendar</h1>
        </div>
        
        <Button 
          onClick={onAddEventClick} 
          size="sm" 
          className="bg-brand hover:bg-brand/90"
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        {view && onViewChange && (
          <Select 
            value={view}
            onValueChange={(value) => onViewChange(value as CalendarView)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayGridMonth">Month</SelectItem>
              <SelectItem value="timeGridWeek">Week</SelectItem>
              <SelectItem value="timeGridDay">Day</SelectItem>
              <SelectItem value="listWeek">List</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {isSuperAdmin && onResetCalendar && (
          <CalendarResetButton 
            onResetCalendar={onResetCalendar} 
            variant="outline" 
            size="sm" 
          />
        )}
      </div>
    </div>
  );
}
