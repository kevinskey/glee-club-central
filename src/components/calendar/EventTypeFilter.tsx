
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface EventTypeFilterProps {
  selectedEventTypes?: string[];
  toggleEventType?: (type: string) => void;
  selectedEventType?: string;
  onEventTypeChange?: (type: string) => void;
  selectedTypes?: string[];
  onToggleType?: (type: string) => void;
}

export function EventTypeFilter({ 
  selectedEventTypes, 
  toggleEventType, 
  selectedEventType, 
  onEventTypeChange,
  selectedTypes,
  onToggleType 
}: EventTypeFilterProps) {
  const eventTypes = ['Concert', 'Rehearsal', 'Workshop', 'Social', 'Meeting'];
  const selected = selectedEventTypes || selectedTypes || [];
  const toggle = toggleEventType || onToggleType || (() => {});

  return (
    <div className="flex flex-wrap gap-2">
      {eventTypes.map((type) => (
        <Badge
          key={type}
          variant={selected.includes(type) ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => toggle(type)}
        >
          {type}
        </Badge>
      ))}
    </div>
  );
}
