
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export function NavItem({ title, href, icon, external = false }: NavItemProps) {
  const location = useLocation();
  
  // Make sure we're only highlighting exact matches or direct children
  const isActive = href !== "/" && 
    (location.pathname === href || 
     (location.pathname.startsWith(`${href}/`) && href !== "/dashboard"));
  
  const linkContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{title}</span>
    </>
  );
  
  return external ? (
    <a
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {linkContent}
    </a>
  ) : (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {linkContent}
    </Link>
  );
}
