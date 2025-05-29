
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/types/calendar';
import { EVENT_TYPES, getEventTypeLabel, getEventTypeColor } from '@/utils/eventTypes';
import { ChevronDown } from 'lucide-react';

interface EventTypeDropdownProps {
  event: CalendarEvent;
  onEventTypesChange: (eventId: string, newTypes: string[]) => void;
  disabled?: boolean;
}

export const EventTypeDropdown: React.FC<EventTypeDropdownProps> = ({
  event,
  onEventTypesChange,
  disabled = false
}) => {
  const currentTypes = event.event_types || (event.event_type ? [event.event_type] : []);

  const handleTypeToggle = (typeValue: string, checked: boolean) => {
    let newTypes: string[];
    
    if (checked) {
      // Add the type if it's not already present
      newTypes = [...currentTypes, typeValue];
    } else {
      // Remove the type
      newTypes = currentTypes.filter(type => type !== typeValue);
    }
    
    // Ensure at least one type is selected
    if (newTypes.length === 0) {
      newTypes = ['event']; // Default to 'event' type
    }
    
    onEventTypesChange(event.id, newTypes);
  };

  if (disabled) {
    // Show read-only badges when disabled
    return (
      <div className="flex flex-wrap gap-1">
        {currentTypes.map(type => (
          <Badge
            key={type}
            variant="outline"
            className={`text-xs ${getEventTypeColor(type)}`}
          >
            {getEventTypeLabel(type)}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-wrap gap-1 cursor-pointer">
          {currentTypes.map(type => (
            <Badge
              key={type}
              variant="outline"
              className={`text-xs ${getEventTypeColor(type)} hover:opacity-80 transition-opacity`}
            >
              {getEventTypeLabel(type)}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto bg-white" align="end">
        <div className="p-2 text-sm font-medium text-muted-foreground">
          Select Event Types
        </div>
        <DropdownMenuSeparator />
        {EVENT_TYPES.map((eventType) => (
          <DropdownMenuCheckboxItem
            key={eventType.value}
            checked={currentTypes.includes(eventType.value)}
            onCheckedChange={(checked) => handleTypeToggle(eventType.value, checked)}
            className="text-sm"
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              getEventTypeColor(eventType.value).includes('purple') ? 'bg-purple-500' :
              getEventTypeColor(eventType.value).includes('blue') ? 'bg-blue-500' :
              getEventTypeColor(eventType.value).includes('green') ? 'bg-green-500' :
              getEventTypeColor(eventType.value).includes('orange') ? 'bg-orange-500' :
              getEventTypeColor(eventType.value).includes('red') ? 'bg-red-500' :
              getEventTypeColor(eventType.value).includes('yellow') ? 'bg-yellow-500' :
              getEventTypeColor(eventType.value).includes('pink') ? 'bg-pink-500' :
              getEventTypeColor(eventType.value).includes('indigo') ? 'bg-indigo-500' :
              getEventTypeColor(eventType.value).includes('cyan') ? 'bg-cyan-500' : 'bg-gray-500'
            }`} />
            {eventType.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
