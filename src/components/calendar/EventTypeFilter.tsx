
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EVENT_TYPES } from '@/utils/eventTypes';

export interface EventTypeFilterProps {
  selectedEventType?: string;
  onEventTypeChange?: (type: string) => void;
}

export function EventTypeFilter({ 
  selectedEventType = 'all', 
  onEventTypeChange = () => {}
}: EventTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedEventType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onEventTypeChange('all')}
        className="h-8"
      >
        All Events
      </Button>
      {EVENT_TYPES.map((eventType) => (
        <Button
          key={eventType.value}
          variant={selectedEventType === eventType.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onEventTypeChange(eventType.value)}
          className="h-8"
        >
          {eventType.label}
        </Button>
      ))}
    </div>
  );
}
