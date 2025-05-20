
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Social", path: "/social" },
    { label: "Contact", path: "/contact" },
    { label: "Press Kit", path: "/press-kit" },
    { label: "Login", path: "/login" },
  ];
  
  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t">
      {/* Include HeaderUtils in mobile menu for easy access */}
      <div className="flex justify-center py-3 border-b">
        <HeaderUtils />
      </div>
      
      <div className="py-4 px-4">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path} onClick={onClose}>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left my-1 py-3 min-h-[44px]"
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
