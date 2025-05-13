
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  children?: React.ReactNode;
}

export function NavItem({ title, href, icon, external = false, children }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  const linkContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children || title}</span>
    </>
  );
  
  return external ? (
    <a
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/10 hover:text-accent",
        isActive && "bg-accent/10 text-accent"
      )}
    >
      {linkContent}
    </a>
  ) : (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/10 hover:text-accent",
        isActive && "bg-accent/10 text-accent"
      )}
    >
      {linkContent}
    </Link>
  );
}
