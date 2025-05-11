
import React from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Logo() {
  const navigate = useNavigate();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Icons.logo className="h-6 w-auto text-glee-purple" />
            <span className="font-playfair text-lg font-semibold text-glee-purple">
              Glee World
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to homepage</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
