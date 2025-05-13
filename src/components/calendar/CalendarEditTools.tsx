
import React from "react";
import {
  Pencil,
  Trash2,
  Plus,
  File,
  Download,
  Upload,
  Calendar,
  Share2,
  FilterX
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/usePermissions";

interface CalendarEditToolsProps {
  onAddEvent: () => void;
  onExportCalendar?: () => void;
  onImportCalendar?: () => void;
  onResetCalendar?: () => void;
  onShareCalendar?: () => void;
  selectedEventId?: string | null;
  onEditSelected?: () => void;
  onDeleteSelected?: () => void;
  className?: string;
}

export function CalendarEditTools({
  onAddEvent,
  onExportCalendar,
  onImportCalendar,
  onResetCalendar,
  onShareCalendar,
  selectedEventId,
  onEditSelected,
  onDeleteSelected,
  className,
}: CalendarEditToolsProps) {
  const { isSuperAdmin } = usePermissions();
  
  if (!isSuperAdmin) return null;
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={onAddEvent}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {selectedEventId && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={onEditSelected}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit selected event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                      onClick={onDeleteSelected}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete selected event</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Separator orientation="vertical" className="h-6 mx-1" />
            </>
          )}
          
          {onExportCalendar && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onExportCalendar}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onImportCalendar && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onImportCalendar}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onShareCalendar && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onShareCalendar}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onResetCalendar && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                      onClick={onResetCalendar}
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset calendar (danger)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
