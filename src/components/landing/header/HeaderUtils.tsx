
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock } from "@/components/ui/clock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeaderUtils() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <ThemeToggle />
      {!isMobile && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Clock />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
