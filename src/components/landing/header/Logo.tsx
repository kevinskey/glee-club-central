
import React from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export function Logo() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Icons.logo className={`${isMobile ? "h-8" : "h-6"} w-auto`} />
            <span className={`font-playfair ${isMobile ? "text-xl" : "text-lg"} font-semibold text-foreground`}>
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
