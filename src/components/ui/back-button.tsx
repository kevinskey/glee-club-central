
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackButton = ({ 
  className = "", 
  label = "Back", 
  fallbackPath = "/dashboard/member",
  size = "default"
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // Check if we came from another page in the app
    if (window.history.state && window.history.state.idx > 0) {
      // If we have history, go back
      navigate(-1);
    } else {
      // If there's no history or we've just loaded the app, navigate to the fallback
      const isDashboardPath = location.pathname.includes('/dashboard');
      const actualFallback = isDashboardPath ? fallbackPath : '/';
      navigate(actualFallback);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
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
