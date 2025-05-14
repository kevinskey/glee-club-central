
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  
  const navigationItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Events", path: "/events" },
    { title: "Videos", path: "/videos" },
    { title: "Recordings", path: "/recordings" },
    { title: "Press Kit", path: "/press-kit" },
    { title: "Contact", path: "/contact" }
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
      <div className="py-2 px-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
        {navigationItems.map((item) => (
          <Button 
            key={item.path}
            variant="ghost" 
            className="justify-start py-3 hover:bg-accent hover:text-accent-foreground font-inter text-base" 
            onClick={() => handleNavigation(item.path)}
          >
            {item.title}
          </Button>
        ))}
        <div className="mt-2 pt-2 border-t border-border">
          <Button 
            variant="default"
            className="w-full bg-glee-spelman hover:bg-glee-spelman/90" 
            onClick={() => handleNavigation("/login")}
          >
            Member Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
