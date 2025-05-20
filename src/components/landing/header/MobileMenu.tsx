
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Music", path: "/music" },
    { label: "Calendar", path: "/calendar" },
  ];
  
  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t">
      <div className="py-4 px-4">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path} onClick={onClose}>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left my-1 py-2"
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
