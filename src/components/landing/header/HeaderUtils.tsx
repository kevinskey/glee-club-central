
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock } from "@/components/ui/clock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeaderUtils() {
  return (
    <>
      <ThemeToggle />
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
    </>
  );
}
