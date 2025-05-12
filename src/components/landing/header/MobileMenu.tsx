
import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="container py-4 px-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
        {/* Mobile menu items */}
        <Button 
          variant="ghost" 
          className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/")}
        >
          Home
        </Button>
        <Button 
          variant="ghost" 
          className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/about")}
        >
          About
        </Button>
        <Button 
          variant="ghost" 
          className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/press-kit")}
        >
          Press Kit
        </Button>
        {isAuthenticated ? (
          <>
            <Button 
              variant="ghost" 
              className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
              onClick={() => handleNavigation("/dashboard")}
            >
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
              onClick={() => handleNavigation("/login")}
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
              onClick={() => handleNavigation("/register")}
            >
              Register
            </Button>
          </>
        )}
        <Button 
          variant="ghost" 
          className="justify-start py-3 hover:bg-glee-spelman hover:text-white" 
          onClick={() => handleNavigation("/contact")}
        >
          Contact
        </Button>
      </div>
    </div>
  );
}
