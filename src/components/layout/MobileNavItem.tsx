
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";

interface MobileNavItemProps {
  href: string;
  title: string;
  onClick?: () => void;
}

export function MobileNavItem({ href, title, onClick }: MobileNavItemProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(href);
    if (onClick) onClick();
  };
  
  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        className="w-full justify-start text-sm"
        onClick={handleClick}
      >
        <ChevronRight className="mr-2 h-4 w-4" />
        {title}
      </Button>
    </SheetClose>
  );
}
