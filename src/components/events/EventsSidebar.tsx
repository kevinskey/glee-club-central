
import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function EventsSidebar() {
  const linkClasses = "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors";
  const activeLinkClasses = "bg-gray-100 dark:bg-gray-800 text-glee-purple dark:text-glee-purple font-medium";
  
  return (
    <div className="w-full">
      <div className="space-y-1">
        <NavLink 
          to="/dashboard/events" 
          className={({ isActive }) => 
            cn(linkClasses, isActive && activeLinkClasses)
          }
          end
        >
          <List className="h-4 w-4" />
          All Events
        </NavLink>
        
        <NavLink 
          to="/dashboard/events/create" 
          className={({ isActive }) => 
            cn(linkClasses, isActive && activeLinkClasses)
          }
        >
          <Plus className="h-4 w-4" />
          Create Event
        </NavLink>
        
        <NavLink 
          to="/dashboard/calendar" 
          className={({ isActive }) => 
            cn(linkClasses, isActive && activeLinkClasses)
          }
        >
          <Calendar className="h-4 w-4" />
          Calendar View
        </NavLink>
      </div>
    </div>
  );
}
