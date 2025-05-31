
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewToggleProps {
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
  className?: string;
}

export function CalendarViewToggle({ currentView, onViewChange, className }: CalendarViewToggleProps) {
  const isMobile = window.innerWidth < 768;

  const viewOptions = [
    {
      key: 'dayGridMonth' as const,
      label: 'Month',
      icon: CalendarDays,
      shortLabel: 'M'
    },
    {
      key: 'timeGridWeek' as const,
      label: 'Week',
      icon: Calendar,
      shortLabel: 'W',
      hideOnMobile: true
    },
    {
      key: 'timeGridDay' as const,
      label: 'Day',
      icon: Clock,
      shortLabel: 'D',
      hideOnMobile: true
    },
    {
      key: 'listWeek' as const,
      label: 'List',
      icon: List,
      shortLabel: 'L'
    }
  ];

  const visibleOptions = viewOptions.filter(option => 
    !isMobile || !option.hideOnMobile
  );

  return (
    <div className={cn("flex border rounded-lg overflow-hidden", className)}>
      {visibleOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentView === option.key;
        
        return (
          <Button
            key={option.key}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(option.key)}
            className={cn(
              "rounded-none border-0 flex items-center gap-1 sm:gap-2",
              isActive 
                ? "bg-glee-spelman text-white hover:bg-glee-spelman/90" 
                : "hover:bg-gray-100"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{option.shortLabel}</span>
          </Button>
        );
      })}
    </div>
  );
}
