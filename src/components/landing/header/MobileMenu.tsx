
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "@/components/ui/clock";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <div className="md:hidden bg-background border-t border-border">
      <div className="container py-3 px-2 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
        <div className="flex justify-center mb-1 sm:mb-2">
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
        </div>
        
        {/* Mobile menu items */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/")}
        >
          Home
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/about")}
        >
          About Us
        </Button>
        {!isAuthenticated && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
              onClick={() => handleNavigation("/login")}
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
              onClick={() => handleNavigation("/register/admin")}
            >
              Admin Registration
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
