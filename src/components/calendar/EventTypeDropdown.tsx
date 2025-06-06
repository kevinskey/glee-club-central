
import React, { useState } from 'react';
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
import { ChevronDown, Loader2 } from 'lucide-react';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const currentTypes = event.event_types || (event.event_type ? [event.event_type] : []);

  const handleTypeToggle = async (typeValue: string, checked: boolean) => {
    setIsUpdating(true);
    
    try {
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
      
      await onEventTypesChange(event.id, newTypes);
    } catch (error) {
      console.error('Error updating event types:', error);
    } finally {
      setIsUpdating(false);
    }
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
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <div className="flex flex-wrap gap-1 cursor-pointer">
          {currentTypes.map((type, index) => (
            <Badge
              key={type}
              variant="outline"
              className={`text-xs ${getEventTypeColor(type)} hover:opacity-80 transition-opacity flex items-center gap-1`}
            >
              {getEventTypeLabel(type)}
              {/* Show chevron only on the last badge and when not updating */}
              {index === currentTypes.length - 1 && (
                isUpdating ? (
                  <Loader2 className="h-2 w-2 animate-spin" />
                ) : (
                  <ChevronDown className="h-2 w-2" />
                )
              )}
            </Badge>
          ))}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 max-h-80 overflow-y-auto bg-white z-50" align="end">
        <div className="p-2 text-xs font-medium text-muted-foreground">
          Select Event Types
        </div>
        <DropdownMenuSeparator />
        {EVENT_TYPES.map((eventType) => (
          <DropdownMenuCheckboxItem
            key={eventType.value}
            checked={currentTypes.includes(eventType.value)}
            onCheckedChange={(checked) => handleTypeToggle(eventType.value, checked)}
            className="text-xs"
            disabled={isUpdating}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
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
