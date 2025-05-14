
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CalendarResetButton } from './CalendarResetButton';
import { usePermissions } from '@/hooks/usePermissions';

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

interface CalendarHeaderProps {
  onAddEvent: () => void;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  userCanCreate?: boolean;
  onResetCalendar?: () => Promise<boolean>;
}

export function CalendarHeader({
  onAddEvent,
  view = 'dayGridMonth',
  onViewChange,
  userCanCreate = true,
  onResetCalendar
}: CalendarHeaderProps) {
  const { isSuperAdmin } = usePermissions();
  
  const handleViewChange = (newView: CalendarView) => {
    onViewChange?.(newView);
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage and view your events and rehearsals
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {onViewChange && (
          <div className="bg-muted rounded-md p-1 mr-2">
            <div className="flex items-center">
              <Button
                variant={view === 'dayGridMonth' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('dayGridMonth')}
                className="rounded-l-md"
              >
                Month
              </Button>
              <Button
                variant={view === 'timeGridWeek' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('timeGridWeek')}
              >
                Week
              </Button>
              <Button
                variant={view === 'timeGridDay' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('timeGridDay')}
                className="rounded-r-md"
              >
                Day
              </Button>
            </div>
          </div>
        )}
        
        {userCanCreate && (
          <Button onClick={onAddEvent} className="ml-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
        
        {isSuperAdmin && onResetCalendar && (
          <CalendarResetButton onResetCalendar={onResetCalendar} className="ml-2" />
        )}
      </div>
    </div>
  );
}
