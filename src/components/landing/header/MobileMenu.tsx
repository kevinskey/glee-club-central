
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

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <div className="md:hidden bg-background border-t border-border">
      <div className="container py-3 px-3 sm:px-4 flex flex-col gap-2">
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/contact")}
        >
          Contact
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/administration")}
        >
          Administration
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/fan-page")}
        >
          For Fans
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/dashboard")}
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start py-2 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/login")}
        >
          Login
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="mt-1 sm:mt-2 py-2 bg-glee-purple hover:bg-glee-spelman"
          onClick={() => handleNavigation("/dashboard")}
        >
          Member Portal
        </Button>
      </div>
    </div>
  );
}
