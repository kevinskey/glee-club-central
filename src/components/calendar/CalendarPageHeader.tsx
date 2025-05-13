
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export const CalendarPageHeader = ({ onAddEventClick }: CalendarPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Calendar className="h-6 w-6 text-glee-spelman mr-2" />
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Event schedule
          </p>
        </div>
      </div>
      
      <Button onClick={onAddEventClick} size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Add
      </Button>
    </div>
  );
}
