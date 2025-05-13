
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  exact?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavItem = ({
  to,
  icon,
  label,
  exact = false,
  disabled = false,
  className,
  onClick,
}: NavItemProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to 
    : location.pathname.startsWith(to);
  
  return (
    <Link
      to={disabled ? "#" : to}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent/10 text-accent font-medium"
          : "text-muted-foreground hover:bg-accent/10 hover:text-accent",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={e => {
        if (disabled) {
          e.preventDefault();
        }
        onClick?.();
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};
