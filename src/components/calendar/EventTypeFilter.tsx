
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EVENT_TYPES } from '@/utils/eventTypes';
import { Filter } from 'lucide-react';

export interface EventTypeFilterProps {
  selectedEventType?: string;
  onEventTypeChange?: (type: string) => void;
}

export function EventTypeFilter({ 
  selectedEventType = 'all', 
  onEventTypeChange = () => {}
}: EventTypeFilterProps) {
  const getSelectedLabel = () => {
    if (selectedEventType === 'all') return 'All Events';
    const eventType = EVENT_TYPES.find(type => type.value === selectedEventType);
    return eventType?.label || 'All Events';
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedEventType} onValueChange={onEventTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type">
            {getSelectedLabel()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
          <SelectItem value="all" className="cursor-pointer">
            All Events
          </SelectItem>
          {EVENT_TYPES.map((eventType) => (
            <SelectItem 
              key={eventType.value} 
              value={eventType.value}
              className="cursor-pointer"
            >
              {eventType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
