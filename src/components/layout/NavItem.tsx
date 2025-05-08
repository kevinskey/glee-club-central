
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: () => React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}

export function NavItem({ href, icon: Icon, children, exact }: NavItemProps) {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === href
    : location.pathname === href || location.pathname.startsWith(`${href}/`);
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {Icon()}
      <span>{children}</span>
    </Link>
  );
}
