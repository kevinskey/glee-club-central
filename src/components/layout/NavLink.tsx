
import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode; // Changed from LucideIcon to ReactNode for compatibility
  disabled?: boolean;
  className?: string;
}

export const NavLink = ({ href, children, icon, disabled = false, className }: NavLinkProps) => {
  const location = useLocation();
  
  // Refined logic to ensure only exact matches or direct children are highlighted
  // For the dashboard, we want it highlighted only when exactly on /dashboard
  const isActive = href !== "/" && 
    (location.pathname === href || 
     (location.pathname.startsWith(`${href}/`) && href !== "/dashboard"));

  return (
    <RouterNavLink
      to={disabled ? "#" : href}
      className={cn(
        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:bg-accent/10 hover:text-accent",
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
