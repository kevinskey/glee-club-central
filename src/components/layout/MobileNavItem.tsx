
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface MobileNavItemProps {
  href: string;
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function MobileNavItem({
  href,
  title,
  icon,
  onClick,
}: MobileNavItemProps) {
  const { pathname } = useLocation();
  
  // More precise active state check - only highlight exact matches
  // or direct children paths, but not for the dashboard
  const isActive = href !== "/" && 
    (pathname === href || 
     (pathname.startsWith(`${href}/`) && href !== "/dashboard"));
  
  return (
    <Link
      to={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-2",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      <span className="text-xs">{title}</span>
    </Link>
  );
}
