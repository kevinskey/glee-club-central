
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BackButtonProps {
  className?: string;
  label?: string;
  fallbackPath?: string;
}

export const BackButton = ({ 
  className = "", 
  label = "Back", 
  fallbackPath = "/dashboard"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Check window.history length to determine if we can go back
    if (window.history.length > 2) {
      navigate(-1); // Go back to previous page in history
    } else {
      // If there's no history, navigate to the fallback path
      navigate(fallbackPath);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className={`mb-3 sm:mb-0 self-start h-7 sm:h-8 px-2 ${className}`}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go back</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
