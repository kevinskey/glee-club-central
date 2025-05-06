
import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const NavLink = ({ href, children, icon, disabled = false, className }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <RouterNavLink
      to={disabled ? "#" : href}
      className={cn(
        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      <span>{children}</span>
    </RouterNavLink>
  );
};
