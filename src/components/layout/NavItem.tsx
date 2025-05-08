
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
  exact?: boolean;
}

export function NavItem({ href, children, icon: Icon, onClick, exact = false }: NavItemProps) {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === href 
    : location.pathname.startsWith(href);
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary text-foreground hover:text-primary"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
