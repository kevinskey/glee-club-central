
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  isDashboard?: boolean;
}

export function MobileMenuToggle({ isOpen, onToggle, isDashboard = false }: MobileMenuToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="md:hidden"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
      <span className="sr-only">{isOpen ? "Close" : "Open"} menu</span>
    </Button>
  );
}
