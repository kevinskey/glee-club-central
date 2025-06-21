import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EVENT_TYPES, getEventTypeLabel } from "@/utils/eventTypes";
import { X, Plus, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface EventTypeSelectorProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  label?: string;
  required?: boolean;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedTypes,
  onTypesChange,
  label = "Event Types",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeToggle = (typeValue: string) => {
    let newTypes: string[];

    if (selectedTypes.includes(typeValue)) {
      // Remove the type
      newTypes = selectedTypes.filter((type) => type !== typeValue);
    } else {
      // Add the type
      newTypes = [...selectedTypes, typeValue];
    }

    // Ensure at least one type is selected if required
    if (newTypes.length === 0 && required) {
      newTypes = ["event"]; // Default to 'event' type
    }

    onTypesChange(newTypes);
  };

  const removeType = (typeToRemove: string) => {
    const newTypes = selectedTypes.filter((type) => type !== typeToRemove);

    // Ensure at least one type is selected if required
    if (newTypes.length === 0 && required) {
      onTypesChange(["event"]);
    } else {
      onTypesChange(newTypes);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="event-types">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Selected Types Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
        {selectedTypes.map((type) => (
          <Badge
            key={type}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {getEventTypeLabel(type)}
            <button
              type="button"
              onClick={() => removeType(type)}
              className="ml-1 hover:text-red-600 transition-colors"
              aria-label={`Remove ${getEventTypeLabel(type)}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {selectedTypes.length === 0 && (
          <span className="text-muted-foreground text-sm py-1">
            No event types selected...
          </span>
        )}
      </div>

      {/* Add Types Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event Type
            <ChevronDown className="h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-3 bg-white dark:bg-gray-800 border shadow-lg z-50"
          align="start"
        >
          <div className="space-y-2">
            <h4 className="font-medium text-sm mb-3">Select Event Types</h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {EVENT_TYPES.map((eventType) => (
                <div
                  key={eventType.value}
                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded-sm cursor-pointer"
                  onClick={() => handleTypeToggle(eventType.value)}
                >
                  <Checkbox
                    checked={selectedTypes.includes(eventType.value)}
                    onCheckedChange={() => handleTypeToggle(eventType.value)}
                    className="pointer-events-auto"
                  />
                  <span className="text-sm flex-1">{eventType.label}</span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
