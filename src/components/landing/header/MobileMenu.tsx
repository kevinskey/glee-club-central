
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
      <div className="container py-4 px-4 flex flex-col gap-2">
        <div className="flex justify-center">
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
          className="justify-start" 
          onClick={() => handleNavigation("/")}
        >
          Home
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/about")}
        >
          About Us
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/contact")}
        >
          Contact
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/administration")}
        >
          Administration
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/fan-page")}
        >
          For Fans
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/dashboard")}
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start" 
          onClick={() => handleNavigation("/login")}
        >
          Login
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="mt-2 bg-glee-purple hover:bg-glee-purple/90"
          onClick={() => handleNavigation("/dashboard")}
        >
          Member Portal
        </Button>
      </div>
    </div>
  );
}
