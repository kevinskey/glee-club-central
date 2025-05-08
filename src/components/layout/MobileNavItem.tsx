
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface MobileNavItemProps {
  href: string;
  title: string;
  onClick?: () => void;
}

export function MobileNavItem({ href, title, onClick }: MobileNavItemProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <SheetClose asChild>
      <Link to={href}>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleClick}
        >
          {title}
        </Button>
      </Link>
    </SheetClose>
  );
}
