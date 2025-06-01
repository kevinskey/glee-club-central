
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
      shortLabel: 'L',
      mobileOnly: true
    },
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
    }
  ];

  const visibleOptions = viewOptions.filter(option => {
    if (isMobile) {
      // On mobile, show List and Month only
      return !option.hideOnMobile;
    } else {
      // On desktop, show all except mobile-only options
      return !option.mobileOnly;
    }
  });

  return (
    <div className={cn("flex border rounded-lg overflow-hidden bg-white dark:bg-gray-800", className)}>
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
              "rounded-none border-0 flex items-center gap-1 sm:gap-2 transition-colors",
              isActive 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
              isMobile ? "px-3 py-2 min-h-[40px]" : "px-4 py-2"
            )}
          >
            <Icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
            {isMobile ? (
              <span className="text-sm font-medium">{option.shortLabel}</span>
            ) : (
              <span className="text-sm font-medium">{option.label}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
