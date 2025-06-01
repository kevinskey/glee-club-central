
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarViewToggleProps {
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
  className?: string;
}

export function CalendarViewToggle({ currentView, onViewChange, className }: CalendarViewToggleProps) {
  const isMobile = useIsMobile();

  const viewOptions = [
    {
      key: 'listWeek' as const,
      label: 'List',
      icon: List,
      shortLabel: 'List',
      showOnMobile: true
    },
    {
      key: 'dayGridMonth' as const,
      label: 'Month',
      icon: CalendarDays,
      shortLabel: 'Month',
      showOnMobile: true
    },
    {
      key: 'timeGridWeek' as const,
      label: 'Week',
      icon: Calendar,
      shortLabel: 'Week',
      showOnMobile: false
    },
    {
      key: 'timeGridDay' as const,
      label: 'Day',
      icon: Clock,
      shortLabel: 'Day',
      showOnMobile: false
    }
  ];

  const visibleOptions = viewOptions.filter(option => {
    if (isMobile) {
      return option.showOnMobile;
    }
    return true;
  });

  return (
    <div className={cn(
      "flex border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm",
      isMobile ? "w-full" : "w-auto",
      className
    )}>
      {visibleOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentView === option.key;
        
        return (
          <Button
            key={option.key}
            variant={isActive ? "default" : "ghost"}
            size={isMobile ? "sm" : "default"}
            onClick={() => onViewChange(option.key)}
            className={cn(
              "rounded-none border-0 flex items-center gap-1 sm:gap-2 transition-colors flex-1",
              isActive 
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
              isMobile ? "px-2 py-2 text-xs" : "px-4 py-2 text-sm",
              "min-h-[40px]"
            )}
          >
            <Icon className={cn("h-4 w-4", isMobile && "h-4 w-4")} />
            <span className="font-medium whitespace-nowrap">
              {isMobile ? option.shortLabel : option.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
